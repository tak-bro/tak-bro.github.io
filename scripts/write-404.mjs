#!/usr/bin/env node
// GitHub Pages serves a top-level 404.html for any unknown path. React Router
// prerenders the /404 route to 404/index.html, so copy it into place. The
// catch-all `*` route cannot be prerendered, which is why /404 exists at all.

import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD_DIR =
  process.env.SITE_BUILD_DIR ??
  fileURLToPath(new URL('../build/client', import.meta.url));

const source = join(BUILD_DIR, '404/index.html');

try {
  await copyFile(source, join(BUILD_DIR, '404.html'));
} catch (error) {
  console.error(`Cannot write 404.html: ${source} was not prerendered (${error.code ?? error.message})`);
  process.exit(1);
}
