#!/usr/bin/env node
// Fails the build when a file that must exist at a fixed URL was not emitted.
//
// /assets/resume.pdf and /assets/resume_eng.pdf are linked from outside this
// site (résumé submissions), so losing them breaks links nobody here can fix.
// GitHub Pages serves 404.html for unknown paths, and index.html is the home.

import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD_DIR =
  process.env.SITE_BUILD_DIR ??
  fileURLToPath(new URL('../build/client', import.meta.url));

const REQUIRED = ['index.html', '404.html', 'assets/resume.pdf', 'assets/resume_eng.pdf'];

const problem = async (file) => {
  const info = await stat(join(BUILD_DIR, file)).catch(() => undefined);
  if (!info?.isFile()) return `${file} is missing`;
  if (info.size === 0) return `${file} is empty`;

  return undefined;
};

const problems = (await Promise.all(REQUIRED.map(problem))).filter(Boolean);

if (problems.length > 0) {
  console.error(`Required files are not in ${BUILD_DIR}:`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`OK: ${REQUIRED.length} required files`);
