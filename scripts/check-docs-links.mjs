#!/usr/bin/env node
// Verifies every internal link in the built docs site points at a page that was
// actually emitted.
//
// This exists because link breakage here is invisible: fumadocs rewrites relative
// links through the loader, and the rewrite depends on the link's shape. A
// same-folder `./page` resolves correctly and keeps the locale, while a
// cross-folder `../other/page` silently loses the /docs prefix and an absolute
// `/docs/...` silently loses the locale. Every one of those still renders as a
// perfectly normal-looking link.
//
// Checking the emitted HTML instead of the MDX source means any future link form
// is judged by whether it works, not by whether someone remembered a rule.

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { BUILD_DIR } from './lib/build-dir.mjs';


const listHtmlFiles = async (dir) => {
  const entries = await readdir(dir, { recursive: true });

  return entries.filter((entry) => entry.endsWith('.html'));
};

// build/client/docs/cli/index.html is served at /docs/cli
const routeForFile = (file) => `/${file.replace(/(^|\/)index\.html$/, '')}`.replace(/\/$/, '') || '/';

const main = async () => {
  let files;
  try {
    files = await listHtmlFiles(BUILD_DIR);
  } catch {
    console.error(`ERROR: no build output at ${relative(process.cwd(), BUILD_DIR)}`);
    console.error('Run `pnpm --filter docs build` first.');
    process.exit(1);
  }

  const routes = new Set(files.map(routeForFile));
  const broken = [];

  for (const file of files) {
    const html = await readFile(join(BUILD_DIR, file), 'utf8');

    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
      // Assets and the static search index are real objects, not routes.
      if (href.startsWith('/assets/') || href.startsWith('/api/') || href.includes('.')) continue;
      if (routes.has(href.replace(/\/$/, '') || '/')) continue;

      broken.push(`${routeForFile(file)} -> ${href}`);
    }
  }

  if (broken.length > 0) {
    console.error(`Broken internal links (${broken.length}):`);
    for (const entry of [...new Set(broken)].sort()) console.error(`  ${entry}`);
    process.exit(1);
  }

  console.log(`OK: ${routes.size} routes, no broken internal links.`);
};

await main();
