#!/usr/bin/env node
// Fails when published sources contain a sensitive pattern (scripts/lib/sensitive.mjs).
// Scans content/, public/, and app/ by default, or the paths given as arguments.
// Exceptions live in config/sensitive-allow.json as [{ "file", "pattern" }], with
// `file` relative to the repo root; SENSITIVE_ALLOW points the test at a fixture.

import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSensitive, formatHits } from './lib/sensitive.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_TARGETS = ['content', 'public', 'app'];
const ALLOW_FILE = process.env.SENSITIVE_ALLOW ?? resolve(ROOT, 'config/sensitive-allow.json');

const allowList = JSON.parse(await readFile(ALLOW_FILE, 'utf8'));
const allowed = (file, pattern) =>
  allowList.some((entry) => resolve(ROOT, entry.file) === resolve(file) && entry.pattern === pattern);

const args = process.argv.slice(2);
const targets = (args.length > 0 ? args : DEFAULT_TARGETS).map((target) => resolve(ROOT, target));

let hits;
try {
  hits = await findSensitive(targets, allowed);
} catch (error) {
  console.error(`check-sensitive: cannot scan ${error.path ?? ''} (${error.code ?? error.message})`);
  process.exit(1);
}

if (hits.length > 0) {
  console.error('Sensitive patterns found:');
  for (const line of formatHits(hits)) console.error(line.replace(ROOT, ''));
  process.exit(1);
}

console.log(`OK: no sensitive patterns in ${targets.map((target) => relative(ROOT, target) || target).join(', ')}`);
