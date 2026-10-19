#!/usr/bin/env node
// Fails when a file that must exist at a fixed URL was not emitted. The resume
// PDFs are linked from outside the site; GitHub Pages needs 404.html.

import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { BUILD_DIR } from './lib/build-dir.mjs';

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
