#!/usr/bin/env node
// GitHub Pages serves 404.html for unknown paths. The catch-all route cannot be
// prerendered, so the /404 route's page is copied into place.
//
// That page was rendered for /404, but it hydrates at whatever address was asked
// for, where the router matches the catch-all instead and React throws #418. The
// inline script below shows the router /404 until hydration; the 404 page then
// puts the visitor's address back (window.__notFoundPath, app/routes/not-found.tsx).

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BUILD_DIR } from './lib/build-dir.mjs';

const source = join(BUILD_DIR, '404/index.html');
const HOLD_PATH =
  '<script>if(!/^\\/404\\/?$/.test(location.pathname)){window.__notFoundPath=location.pathname+location.search+location.hash;history.replaceState(history.state,"","/404")}</script>';

let html;
try {
  html = await readFile(source, 'utf8');
} catch (error) {
  console.error(`Cannot write 404.html: ${source} was not prerendered (${error.code ?? error.message})`);
  process.exit(1);
}

if (!html.includes('<head>')) {
  console.error(`Cannot write 404.html: no <head> in ${source}`);
  process.exit(1);
}

await writeFile(join(BUILD_DIR, '404.html'), html.replace('<head>', `<head>${HOLD_PATH}`));
