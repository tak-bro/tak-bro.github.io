#!/usr/bin/env node
// Imports the old Jekyll blog (a private repo) into content/blog as MDX.
//
//   node scripts/import-jekyll.mjs <jekyll root> [--out <site root>]
//
// Posts live in <category>/_posts/YYYY-MM-DD-<slug>.md; the date and slug come
// from the file name and the category becomes the only tag. Jekyll-only syntax
// is rewritten outside code so the result compiles as MDX, and anything that
// must not be published is masked. The whole output directory is staged,
// scanned, and swapped in at once, so a failed run leaves the old one intact.
// Re-run it after changing a rule here; never hand-edit the generated files.

import { mkdir, mkdtemp, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSensitive, formatHits } from './lib/sensitive.mjs';

const POST_FILE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

const fail = (message) => {
  console.error(`import-jekyll: ${message}`);
  process.exit(1);
};

const parseArgs = (argv) => {
  const [source, ...rest] = argv;
  if (!source) fail('usage: import-jekyll.mjs <jekyll root> [--out <site root>]');
  const outIndex = rest.indexOf('--out');
  const out = outIndex === -1 ? fileURLToPath(new URL('..', import.meta.url)) : rest[outIndex + 1];

  return { source: resolve(source), out: resolve(out) };
};

/** Scalars and `key: >` folded blocks — the only shapes the old posts use. */
const parseFrontmatter = (text) => {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text };
  const data = {};
  const lines = match[1].split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const field = /^(\w+):\s*(.*)$/.exec(lines[index]);
    if (!field) continue;
    const [, key, value] = field;
    if (value === '>' || value === '|') {
      const block = [];
      while (index + 1 < lines.length && /^\s+\S|^\s*$/.test(lines[index + 1]) && !/^\w+:/.test(lines[index + 1])) {
        block.push(lines[(index += 1)].trim());
      }
      data[key] = block.filter(Boolean).join(' ');
    } else {
      data[key] = value.replace(/^(['"])(.*)\1$/, '$2');
    }
  }

  return { data, body: text.slice(match[0].length) };
};

const yamlString = (value) => JSON.stringify(value);

const MASKS = [
  [/\b5[HJK][1-9A-HJ-NP-Za-km-z]{49}\b/g, '<private-key>'],
  [/\bPW5[1-9A-HJ-NP-Za-km-z]{40,}/g, '<wallet-password>'],
  [/\bPVT_K1_[1-9A-HJ-NP-Za-km-z]{40,}/g, '<private-key>'],
  [/\/Users\/tak\b/g, '~'],
  [/@lemoncloud\//g, '@my-org/'],
];

const mask = (text) => MASKS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);

// Tags MDX accepts as JSX; any other `<` in prose is text and gets escaped.
const HTML_TAG = /^<\/?(a|b|br|center|code|del|details|div|em|font|h[1-6]|hr|i|iframe|img|kbd|li|ol|p|pre|span|strong|sub|summary|sup|table|tbody|td|th|thead|tr|u|ul)\b[^<>]*>/i;

const JSX_ATTRIBUTES = [
  [/\bclass=/g, 'className='],
  [/\bframeborder=/gi, 'frameBorder='],
  [/\ballowfullscreen\b/gi, 'allowFullScreen'],
];

const convertProse = (text) => {
  let result = text
    .replace(/\{:[^}]*\}/g, '')
    .replace(/<br\s*\/?>/gi, '<br />')
    .replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)')
    .replace(/\/blog\/[\w-]+\/\d{4}-\d{2}-\d{2}-([\w-]+)\/?(?=\))/g, '/blog/$1')
    .replace(/[{}]/g, (brace) => `\\${brace}`);
  result = result.replace(/<[^<]*/g, (fragment) => (HTML_TAG.test(fragment) ? fragment : `&lt;${fragment.slice(1)}`));

  return JSX_ATTRIBUTES.reduce((line, [pattern, replacement]) => line.replace(pattern, replacement), result);
};

// Inline code spans pass through untouched; triple-backtick spans written
// mid-line in the old posts become single-backtick spans.
const convertLine = (line) =>
  line
    .replace(/```([^`]+)```/g, '`$1`')
    .split(/(`[^`]*`)/)
    .map((part, index) => (index % 2 === 1 ? part : convertProse(part)))
    .join('');

const FENCE = /^\s*```/;

const HEADING = /^(#{1,6})(\s)/;

// The page title is the only h1; body headings keep their order but take
// consecutive levels from h2, so `#` then `####` becomes h2 then h3.
const headingLevels = (lines) => {
  const levels = new Set();
  let inFence = false;
  for (const line of lines) {
    if (FENCE.test(line) && !/^\s*```[^`]*```/.test(line)) inFence = !inFence;
    else if (!inFence && HEADING.test(line)) levels.add(HEADING.exec(line)[1].length);
  }

  return new Map([...levels].sort().map((level, index) => [level, Math.min(index + 2, 6)]));
};

export const convertBody = (body) => {
  const out = [];
  const lines = body.split('\n');
  const levels = headingLevels(lines);
  let inFence = false;
  for (const line of lines) {
    if (!inFence && /^\s*```[^`]*```/.test(line)) {
      out.push(convertLine(line));
    } else if (FENCE.test(line)) {
      out.push(inFence ? line : line.replace(/^(\s*```)c\+\+/, '$1cpp').trimEnd());
      inFence = !inFence;
    } else if (inFence) {
      out.push(line);
    } else if (/^\s*\{:[^}]*\}\s*$/.test(line)) {
      continue;
    } else {
      const heading = HEADING.exec(line);
      const relevelled = heading ? `${'#'.repeat(levels.get(heading[1].length))}${line.slice(heading[1].length)}` : line;
      out.push(convertLine(relevelled));
    }
  }

  return out.join('\n');
};

const IMAGE_DIR = '/assets/img/';
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\((\/[^)\s]+)\)/g;

const exists = async (path) => (await stat(path).catch(() => undefined))?.isFile() ?? false;

/**
 * Local images under /assets/img/ are collected for copying, keeping their URL.
 * An image the source repo does not have (some were already broken there)
 * is replaced by its alt text, since fumadocs resolves every image at build.
 */
const resolveImages = async (text, source, assets) => {
  const replacements = new Map();
  for (const [image, alt, url] of text.matchAll(MARKDOWN_IMAGE)) {
    if (url.startsWith(IMAGE_DIR) && (await exists(join(source, url)))) assets.add(url);
    else replacements.set(image, alt);
  }

  return [...replacements].reduce((result, [image, alt]) => result.split(image).join(alt), text);
};

const listPosts = async (source) => {
  const categories = await readdir(source, { withFileTypes: true });
  const posts = [];
  for (const category of categories) {
    if (!category.isDirectory()) continue;
    const dir = join(source, category.name, '_posts');
    const files = await readdir(dir).catch(() => []);
    for (const file of files) {
      const match = POST_FILE.exec(file);
      if (match) posts.push({ path: join(dir, file), tag: category.name, date: match[1], slug: match[2] });
    }
  }

  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
};

const renderPost = async ({ path, tag, date }, source, assets) => {
  // Masked before conversion, so a placeholder in prose gets escaped like any other `<`.
  const { data, body } = parseFrontmatter(mask(await readFile(path, 'utf8')));
  const frontmatter = [
    '---',
    `title: ${yamlString(data.title)}`,
    `description: ${yamlString(data.description || data.title)}`,
    `date: ${yamlString(date)}`,
    `tags: [${yamlString(tag)}]`,
    '---',
    '',
  ].join('\n');

  const content = await resolveImages(convertBody(body).trim(), source, assets);

  return `${frontmatter}${content}\n`;
};

// Staged next to the target so the final rename stays on one filesystem.
const stageDir = async (target, files) => {
  await mkdir(dirname(target), { recursive: true });
  const staging = await mkdtemp(`${target}.staging-`);
  for (const [name, data] of files) {
    await mkdir(dirname(join(staging, name)), { recursive: true });
    await writeFile(join(staging, name), data);
  }

  return staging;
};

const swapDir = async (target, staging) => {
  const previous = `${target}.previous`;
  await rm(previous, { recursive: true, force: true });
  await rename(target, previous).catch(() => {});
  await rename(staging, target);
  await rm(previous, { recursive: true, force: true });
};

/** Stages every directory and scans them all before swapping any in. */
const replaceDirs = async (outputs) => {
  const stagings = [];
  try {
    for (const [target, files] of outputs) stagings.push([target, await stageDir(target, files)]);
    const hits = await findSensitive(stagings.map(([, staging]) => staging));
    if (hits.length > 0) {
      console.error('import-jekyll: sensitive patterns remain after masking, nothing was written:');
      for (const line of formatHits(hits)) console.error(line);
      return false;
    }
    for (const [target, staging] of stagings) await swapDir(target, staging);
    return true;
  } finally {
    for (const [, staging] of stagings) await rm(staging, { recursive: true, force: true });
  }
};

const { source, out } = parseArgs(process.argv.slice(2));
const posts = await listPosts(source);
if (posts.length === 0) fail(`no posts under ${source}/*/_posts`);
const seen = new Map();
for (const post of posts) {
  if (seen.has(post.slug)) fail(`slug "${post.slug}" is used by ${seen.get(post.slug)} and ${post.path}`);
  seen.set(post.slug, post.path);
}

const assets = new Set();
const files = await Promise.all(posts.map(async (post) => [`${post.slug}.mdx`, await renderPost(post, source, assets)]));
const images = await Promise.all(
  [...assets].sort().map(async (url) => [url.slice(IMAGE_DIR.length), await readFile(join(source, url))]),
);
const written = await replaceDirs([
  [join(out, 'content/blog'), files],
  [join(out, `public${IMAGE_DIR.slice(0, -1)}`), images],
]);
if (!written) process.exit(1);
console.log(`OK: imported ${files.length} posts and ${images.length} images`);
