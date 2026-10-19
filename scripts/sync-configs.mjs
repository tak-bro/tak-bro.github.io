#!/usr/bin/env node
// Copies allowlisted config files from private repos into content/snippets/<repo>/.
//
// The snippets are published, so every file is staged in a temporary directory
// and scanned first; content/snippets is replaced only when the whole set is
// clean and every allowlist entry is valid. Otherwise nothing changes.
// Entries in config/sync-allowlist.json are { repo, from, to }: `from` is
// relative to the repo root, `to` relative to snippets/<repo>/.

import { copyFile, mkdir, mkdtemp, readFile, rename, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSensitive, formatHits } from './lib/sensitive.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_ROOTS = {
  dotfiles: process.env.DOTFILES_DIR ?? join(homedir(), 'workspace/tak-bro/dotfiles'),
  'agent-config': process.env.AGENT_CONFIG_DIR ?? join(homedir(), 'workspace/tak-bro/agent-config'),
};
const ALLOWLIST = process.env.SYNC_ALLOWLIST ?? resolve(ROOT, 'config/sync-allowlist.json');
const SNIPPETS = process.env.SNIPPETS_DIR ?? resolve(ROOT, 'content/snippets');

const fail = (message) => {
  console.error(`sync-configs: ${message}`);
  process.exit(1);
};

const isSafeRelative = (path) =>
  typeof path === 'string' && path !== '' && !isAbsolute(path) && !normalize(path).split(sep).includes('..');

const entries = JSON.parse(await readFile(ALLOWLIST, 'utf8'));

for (const { repo, from, to } of entries) {
  if (!Object.hasOwn(SOURCE_ROOTS, repo)) fail(`unknown repo "${repo}"`);
  if (!isSafeRelative(from)) fail(`"from" must stay inside the repo: ${from}`);
  if (!isSafeRelative(to)) fail(`"to" must stay inside snippets: ${to}`);
  const source = join(SOURCE_ROOTS[repo], from);
  if (!(await stat(source).catch(() => undefined))?.isFile()) fail(`source is missing: ${repo}/${from}`);
}

// Staged next to the target so the final rename stays on one filesystem.
await mkdir(dirname(SNIPPETS), { recursive: true });
const staging = await mkdtemp(`${SNIPPETS}.staging-`);
try {
  for (const { repo, from, to } of entries) {
    const target = join(staging, repo, to);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(SOURCE_ROOTS[repo], from), target);
  }

  // No exceptions here: config/sensitive-allow.json is for files written in this
  // repo, and a synced file that needs one should be dropped from the allowlist.
  const hits = await findSensitive([staging]);
  if (hits.length > 0) {
    console.error('sync-configs: sensitive patterns found, nothing was written:');
    for (const line of formatHits(hits)) console.error(line.replace(`${staging}${sep}`, ''));
    process.exitCode = 1;
  } else {
    const previous = `${SNIPPETS}.previous`;
    await rm(previous, { recursive: true, force: true });
    if (await stat(SNIPPETS).catch(() => undefined)) await rename(SNIPPETS, previous);
    await rename(staging, SNIPPETS);
    await rm(previous, { recursive: true, force: true });
    console.log(`OK: synced ${entries.length} file(s) into ${SNIPPETS}`);
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}
