#!/usr/bin/env node
// GitHub Pages serves 404.html for unknown paths. The catch-all route cannot be
// prerendered, so the /404 route's page is copied into place.

import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BUILD_DIR } from './lib/build-dir.mjs';

const source = join(BUILD_DIR, '404/index.html');

try {
  await copyFile(source, join(BUILD_DIR, '404.html'));
} catch (error) {
  console.error(`Cannot write 404.html: ${source} was not prerendered (${error.code ?? error.message})`);
  process.exit(1);
}
