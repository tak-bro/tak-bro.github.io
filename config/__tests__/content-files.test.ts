import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { listMdxFiles } from '../content-files';

// The prerender list in react-router.config.ts is built from this. A file it
// misses is a page that never gets an HTML key in build/client, so the fixture
// deliberately mixes nesting, a non-.mdx sibling, and an .mdx-like suffix.
describe('listMdxFiles', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'site-content-'));
    await mkdir(join(dir, 'cli', 'deep'), { recursive: true });

    await writeFile(join(dir, 'index.mdx'), '');
    await writeFile(join(dir, 'cli', 'usage.mdx'), '');
    await writeFile(join(dir, 'cli', 'deep', 'encryption.mdx'), '');
    await writeFile(join(dir, 'notes.md'), '');
    await writeFile(join(dir, 'meta.json'), '');
    await writeFile(join(dir, 'not-really.mdx.bak'), '');
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns every .mdx file, nested ones included, as posix paths', async () => {
    await expect(listMdxFiles(dir)).resolves.toEqual([
      'cli/deep/encryption.mdx',
      'cli/usage.mdx',
      'index.mdx',
    ]);
  });

  it('excludes files that only look like mdx', async () => {
    const files = await listMdxFiles(dir);

    expect(files).not.toContain('notes.md');
    expect(files).not.toContain('meta.json');
    expect(files).not.toContain('not-really.mdx.bak');
  });
});
