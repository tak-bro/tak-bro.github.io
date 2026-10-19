import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';

type AllowlistEntry = { repo: string; to: string };

const FENCE = /^(```|~~~)[\s\S]*?^\1/gm;
const INCLUDE = /<include\b([^>]*)>([^<]+)<\/include>/g;

const isFile = async (path: string) => (await stat(path).catch(() => undefined))?.isFile() ?? false;

/**
 * Every `<include>` in the docs that does not point at an allowlisted, synced snippet.
 * Paths resolve the way fumadocs-mdx does: from `cwd` (the project root) when the
 * tag has a `cwd` attribute, else from the mdx file, with any `#section` dropped.
 */
export const snippetIncludeGaps = async (
  docsDir: string,
  snippetsDir: string,
  allowlist: readonly AllowlistEntry[],
  cwd: string,
): Promise<string[]> => {
  const allowed = new Set(allowlist.map(({ repo, to }) => resolve(snippetsDir, repo, to)));
  const files = (await readdir(docsDir, { recursive: true })).filter((file) => /\.mdx?$/.test(file));
  const gaps: string[] = [];

  for (const file of files) {
    const body = (await readFile(join(docsDir, file), 'utf8')).replace(FENCE, '');

    for (const [, attributes, raw] of body.matchAll(INCLUDE)) {
      const ref = raw.trim();
      const section = ref.lastIndexOf('#');
      const path = section === -1 ? ref : ref.slice(0, section);
      const base = /(?:^|\s)cwd(?=[\s=]|$)/.test(attributes.replace(/"[^"]*"|'[^']*'/g, '')) ? cwd : join(docsDir, dirname(file));
      const target = resolve(base, path);
      const label = `${file.split(sep).join('/')}: ${ref}`;

      if (relative(snippetsDir, target).startsWith('..')) gaps.push(`${label} is outside content/snippets`);
      else if (!allowed.has(target)) gaps.push(`${label} is not in config/sync-allowlist.json`);
      else if (!(await isFile(target))) gaps.push(`${label} does not exist (run just sync-configs)`);
    }
  }

  return gaps.sort();
};
