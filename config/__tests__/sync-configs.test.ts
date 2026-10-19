import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const SCRIPT = fileURLToPath(new URL('../../scripts/sync-configs.mjs', import.meta.url));

interface Entry {
  repo: string;
  from: string;
  to: string;
}

/**
 * Snippets come from private repos into a public one, so the sync copies only
 * what the allowlist names and writes nothing at all when any file fails the
 * sensitive check or any entry is invalid.
 */
describe('sync-configs', () => {
  let dir: string | undefined;

  const setup = async (allowlist: Entry[], sources: Record<string, string>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-sync-'));
    for (const [path, body] of Object.entries(sources)) {
      await mkdir(join(dir, path, '..'), { recursive: true });
      await writeFile(join(dir, path), body);
    }
    const snippets = join(dir, 'site/content/snippets');
    await mkdir(snippets, { recursive: true });
    await writeFile(join(snippets, 'previous.txt'), 'previous run');
    await writeFile(join(dir, 'allowlist.json'), JSON.stringify(allowlist));

    const sync = () =>
      run(process.execPath, [SCRIPT], {
        env: {
          ...process.env,
          DOTFILES_DIR: join(dir!, 'dotfiles'),
          AGENT_CONFIG_DIR: join(dir!, 'agent-config'),
          SYNC_ALLOWLIST: join(dir!, 'allowlist.json'),
          SNIPPETS_DIR: snippets,
        },
      })
        .then(({ stdout }) => ({ code: 0, output: stdout }))
        .catch((error: { code?: number; stdout?: string; stderr?: string }) => ({
          code: error.code ?? 1,
          output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
        }));

    const snippetFiles = async () => (await readdir(snippets, { recursive: true })).sort();

    return { snippets, sync, snippetFiles };
  };

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('copies only allowlisted files into snippets/<repo>/ and drops stale ones', async () => {
    const { snippets, sync, snippetFiles } = await setup(
      [
        { repo: 'dotfiles', from: 'herdr/config.toml', to: 'herdr/config.toml' },
        { repo: 'agent-config', from: 'claude/RULES.md', to: 'rules.md' },
      ],
      {
        'dotfiles/herdr/config.toml': 'theme = "dark"\n',
        'dotfiles/herdr/secret.toml': 'not listed\n',
        'agent-config/claude/RULES.md': '# rules\n',
      },
    );

    const result = await sync();

    expect(result.code).toBe(0);
    expect(await snippetFiles()).toEqual([
      'agent-config',
      'agent-config/rules.md',
      'dotfiles',
      'dotfiles/herdr',
      'dotfiles/herdr/config.toml',
    ]);
    await expect(readFile(join(snippets, 'dotfiles/herdr/config.toml'), 'utf8')).resolves.toBe('theme = "dark"\n');
  });

  it.each<[string, Entry[], Record<string, string>, string]>([
    [
      'a source holds a sensitive pattern',
      [
        { repo: 'dotfiles', from: 'clean.toml', to: 'clean.toml' },
        { repo: 'dotfiles', from: 'leak.toml', to: 'leak.toml' },
      ],
      { 'dotfiles/clean.toml': 'ok\n', 'dotfiles/leak.toml': 'user = "someone@lemoncloud.io"\n' },
      'leak.toml',
    ],
    ['`from` escapes the repo', [{ repo: 'dotfiles', from: '../secret', to: 'x' }], { secret: 'x' }, '../secret'],
    ['`to` escapes snippets', [{ repo: 'dotfiles', from: 'a', to: '../../a' }], { 'dotfiles/a': 'x' }, '../../a'],
    ['`from` is absolute', [{ repo: 'dotfiles', from: '/etc/hosts', to: 'hosts' }], {}, '/etc/hosts'],
    ['the repo is unknown', [{ repo: 'mystery', from: 'a', to: 'a' }], {}, 'mystery'],
    ['the repo is an object key', [{ repo: 'toString', from: 'a', to: 'a' }], {}, 'unknown repo "toString"'],
    ['the source is missing', [{ repo: 'dotfiles', from: 'gone.toml', to: 'gone.toml' }], {}, 'gone.toml'],
  ])('writes nothing and exits 1 when %s', async (_name, allowlist, sources, named) => {
    const { sync, snippetFiles } = await setup(allowlist, sources);

    const result = await sync();

    expect(result.code).toBe(1);
    expect(result.output).toContain(named);
    expect(await snippetFiles()).toEqual(['previous.txt']);
  });
});
