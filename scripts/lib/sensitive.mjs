// Patterns that must never reach this public repo: work identity, local paths,
// and credential shapes. Shared by check-sensitive.mjs and sync-configs.mjs.

import { open, readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

export const PATTERNS = [
  { name: '@lemoncloud.io', regex: /@lemoncloud\.io/i },
  { name: 'louis-lemon', regex: /louis-lemon/i },
  { name: 'lemoncloud', regex: /lemoncloud/i },
  { name: '/Users/tak', regex: /\/Users\/tak\b/ },
  { name: 'ghp_', regex: /ghp_[A-Za-z0-9]/ },
  { name: 'github_pat_', regex: /github_pat_[A-Za-z0-9]/ },
  { name: 'sk-ant-', regex: /sk-ant-[A-Za-z0-9]/ },
  { name: 'AKIA', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'PRIVATE KEY', regex: /BEGIN .*PRIVATE KEY/ },
];

const BINARY_PROBE = 8192;

// A NUL byte near the start means a binary (PDF, image), which is not scanned:
// the resume PDF names a past employer and is published on purpose.
const isBinary = async (file) => {
  const handle = await open(file, 'r');
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(BINARY_PROBE), 0, BINARY_PROBE, 0);
    return buffer.subarray(0, bytesRead).includes(0);
  } finally {
    await handle.close();
  }
};

const listFiles = async (target) => {
  const info = await stat(target);
  if (info.isFile()) return [target];

  // Symlinks are followed: vite copies a linked file in public/ as its contents.
  const entries = await readdir(target, { recursive: true, withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(entry.parentPath, entry.name);
      const isFile = entry.isSymbolicLink() ? (await stat(path)).isFile() : entry.isFile();
      return isFile ? [path] : [];
    }),
  );
  return files.flat();
};

/**
 * Every pattern hit under `targets` (files or directories), as
 * `{ file, line, pattern }`. `allowed(file, pattern)` exempts one hit.
 * A missing target throws: a gate that scans nothing must not pass.
 */
export const findSensitive = async (targets, allowed = () => false) => {
  const hits = [];
  for (const target of targets) {
    for (const file of (await listFiles(target)).sort()) {
      if (await isBinary(file)) continue;
      const lines = (await readFile(file, 'utf8')).split('\n');
      lines.forEach((text, index) => {
        for (const { name, regex } of PATTERNS) {
          if (regex.test(text) && !allowed(file, name)) hits.push({ file, line: index + 1, pattern: name });
        }
      });
    }
  }

  return hits;
};

export const formatHits = (hits) => hits.map(({ file, line, pattern }) => `  ${file}:${line} matches ${pattern}`);
