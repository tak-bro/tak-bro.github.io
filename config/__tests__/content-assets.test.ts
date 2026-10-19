import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { missingAssets } from '../content-assets';

const siteRoot = fileURLToPath(new URL('../../', import.meta.url));

/**
 * Every local image an MDX page references must exist under public/. fumadocs
 * resolves body images at build time, but a `src="/..."` attribute or a
 * frontmatter screenshot is emitted verbatim, so a missing file only shows up
 * as a broken image on the live site.
 */
describe('content assets', () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  const fixture = async (files: Record<string, string>): Promise<string> => {
    dir = await mkdtemp(join(tmpdir(), 'site-assets-'));
    for (const [file, body] of Object.entries(files)) {
      await mkdir(join(dir, file, '..'), { recursive: true });
      await writeFile(join(dir, file), body);
    }

    return dir;
  };

  it('finds every referenced image in the real content', async () => {
    await expect(missingAssets(join(siteRoot, 'content'), join(siteRoot, 'public'))).resolves.toEqual([]);
  });

  it('reports markdown, src attribute, and screenshot references that are missing', async () => {
    const root = await fixture({
      'content/blog/a.mdx': '---\nscreenshot: "/img/shot.png"\n---\n![x](/img/here.png)\n![y](/img/gone.png)\n<img src="/img/attr.png" />\n',
      'public/img/here.png': '',
    });

    await expect(missingAssets(join(root, 'content'), join(root, 'public'))).resolves.toEqual([
      'blog/a.mdx: /img/attr.png',
      'blog/a.mdx: /img/gone.png',
      'blog/a.mdx: /img/shot.png',
    ]);
  });

  it('ignores external images and references inside code fences', async () => {
    const root = await fixture({
      'content/a.mdx': '![x](https://example.com/a.png)\n```md\n![y](/img/in-code.png)\n```\n',
    });

    await expect(missingAssets(join(root, 'content'), join(root, 'public'))).resolves.toEqual([]);
  });
});
