import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { snippetIncludeGaps } from '../snippet-includes';

const root = fileURLToPath(new URL('../../', import.meta.url));

/**
 * Docs show config through `<include>` so the page follows the synced file.
 * Only allowlisted snippets have passed the sensitive gate, so an include of
 * anything else (a hand-copied file, a path outside snippets) must fail.
 */
describe('snippet includes', () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  const fixture = async (files: Record<string, string>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-include-'));
    for (const [file, body] of Object.entries(files)) {
      await mkdir(join(dir, file, '..'), { recursive: true });
      await writeFile(join(dir, file), body);
    }

    return { docs: join(dir, 'docs'), snippets: join(dir, 'snippets'), cwd: dir };
  };

  const allowlist = [{ repo: 'dotfiles', to: 'herdr/config.toml' }];

  it('accepts an include of an allowlisted snippet', async () => {
    const { docs, snippets, cwd } = await fixture({
      'docs/guide.mdx': '<include lang="toml">../snippets/dotfiles/herdr/config.toml</include>\n',
      'snippets/dotfiles/herdr/config.toml': 'a = 1\n',
    });

    await expect(snippetIncludeGaps(docs, snippets, allowlist, cwd)).resolves.toEqual([]);
  });

  it('reports includes outside the allowlist, outside snippets, and missing files', async () => {
    const { docs, snippets, cwd } = await fixture({
      'docs/guide.mdx': [
        '<include>../snippets/dotfiles/hand-copied.toml</include>',
        '<include lang="ts">../../package.json</include>',
        '',
      ].join('\n'),
      'docs/nested/page.en.mdx': '<include>../../snippets/dotfiles/herdr/config.toml</include>\n',
      'snippets/dotfiles/hand-copied.toml': 'b = 2\n',
    });

    await expect(snippetIncludeGaps(docs, snippets, allowlist, cwd)).resolves.toEqual([
      'guide.mdx: ../../package.json is outside content/snippets',
      'guide.mdx: ../snippets/dotfiles/hand-copied.toml is not in config/sync-allowlist.json',
      'nested/page.en.mdx: ../../snippets/dotfiles/herdr/config.toml does not exist (run just sync-configs)',
    ]);
  });

  it('resolves from the project root with cwd and drops a #section suffix, as fumadocs does', async () => {
    const { docs, snippets, cwd } = await fixture({
      'docs/guide.mdx': [
        '<include cwd lang="toml">snippets/dotfiles/herdr/config.toml</include>',
        '<include cwd>../snippets/dotfiles/herdr/config.toml</include>',
        '<include>../snippets/dotfiles/herdr/config.toml#keys</include>',
        `<include meta='title="cwd"'>../snippets/dotfiles/herdr/config.toml</include>`,
        '',
      ].join('\n'),
      'snippets/dotfiles/herdr/config.toml': 'a = 1\n',
    });

    await expect(snippetIncludeGaps(docs, snippets, allowlist, cwd)).resolves.toEqual([
      'guide.mdx: ../snippets/dotfiles/herdr/config.toml is outside content/snippets',
    ]);
  });

  it('ignores include tags inside fenced code', async () => {
    const { docs, snippets, cwd } = await fixture({
      'docs/guide.mdx': '```mdx\n<include>../../secret.txt</include>\n```\n',
    });

    await expect(snippetIncludeGaps(docs, snippets, allowlist, cwd)).resolves.toEqual([]);
  });

  it('has no gaps in the real docs', async () => {
    const real = JSON.parse(await readFile(join(root, 'config/sync-allowlist.json'), 'utf8'));

    await expect(
      snippetIncludeGaps(join(root, 'content/docs'), join(root, 'content/snippets'), real, root),
    ).resolves.toEqual([]);
  });
});
