import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { localeParityGaps } from '../locale-parity';
import { DOCS_CONTENT_DIR } from '../../app/lib/shared';

const contentDir = fileURLToPath(new URL(`../../${DOCS_CONTENT_DIR}`, import.meta.url));

/**
 * Korean is the source and English its translation, so every docs page and every
 * meta.json needs its counterpart. fumadocs would quietly serve the Korean page
 * at /en/... when a translation is missing, which is the failure this guards.
 */
describe('locale parity', () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  const fixture = async (files: Record<string, string>): Promise<string> => {
    dir = await mkdtemp(join(tmpdir(), 'site-parity-'));
    for (const [file, body] of Object.entries(files)) {
      await mkdir(join(dir, file, '..'), { recursive: true });
      await writeFile(join(dir, file), body);
    }

    return dir;
  };

  it('has an English file for every Korean file in the real content', async () => {
    await expect(localeParityGaps(contentDir)).resolves.toEqual([]);
  });

  it('reports a Korean page without its English translation', async () => {
    const root = await fixture({ 'a/page.mdx': '', 'a/other.mdx': '', 'a/other.en.mdx': '' });

    await expect(localeParityGaps(root)).resolves.toEqual(['a/page.en.mdx is missing (for a/page.mdx)']);
  });

  it('reports an English page with no Korean source', async () => {
    const root = await fixture({ 'orphan.en.mdx': '' });

    await expect(localeParityGaps(root)).resolves.toEqual(['orphan.mdx is missing (for orphan.en.mdx)']);
  });

  it('pairs meta.json with meta.en.json', async () => {
    const root = await fixture({ 'g/meta.json': '{}', 'meta.en.json': '{}' });

    await expect(localeParityGaps(root)).resolves.toEqual([
      'g/meta.en.json is missing (for g/meta.json)',
      'meta.json is missing (for meta.en.json)',
    ]);
  });
});
