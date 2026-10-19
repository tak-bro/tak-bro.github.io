import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const SCRIPT = fileURLToPath(new URL('../../scripts/check-docs-links.mjs', import.meta.url));

/**
 * Exercises the shipped script, not a copy of its logic, because the thing that
 * can rot is the mapping from an emitted file to the route it is served at —
 * build/client/docs/cli/index.html is reachable as /docs/cli, and a checker that
 * got that wrong would either pass everything or fail everything.
 */
const checkLinks = async (buildDir: string) =>
  run(process.execPath, [SCRIPT], { env: { ...process.env, SITE_BUILD_DIR: buildDir } })
    .then(({ stdout }) => ({ code: 0, output: stdout }))
    .catch((error: { code?: number; stdout?: string; stderr?: string }) => ({
      code: error.code ?? 1,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    }));

describe('check-docs-links', () => {
  let dir: string | undefined;

  const buildTree = async (files: Record<string, string>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-links-'));

    for (const [path, html] of Object.entries(files)) {
      const full = join(dir, path);
      await mkdir(join(full, '..'), { recursive: true });
      await writeFile(full, html);
    }

    return dir;
  };

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('accepts a link to a page that exists', async () => {
    const tree = await buildTree({
      'index.html': '<a href="/docs/cli">CLI</a>',
      'docs/cli/index.html': '<a href="/">home</a>',
    });

    const result = await checkLinks(tree);

    expect(result.code).toBe(0);
    expect(result.output).toContain('no broken internal links');
  });

  it('rejects a link to a page that was never emitted', async () => {
    const tree = await buildTree({
      'docs/mcp/index.html': '<a href="/cli/encryption">Encryption</a>',
    });

    const result = await checkLinks(tree);

    expect(result.code).toBe(1);
    expect(result.output).toContain('/docs/mcp -> /cli/encryption');
  });

  it('checks localized pages too', async () => {
    // The failure this whole checker exists for shows up only under /en: an
    // absolute link resolves on the Korean page and dead-ends on the English one.
    const tree = await buildTree({
      'docs/plugin/index.html': '<a href="/docs/plugin/push-modes">modes</a>',
      'docs/plugin/push-modes/index.html': 'ok',
      'en/docs/plugin/index.html': '<a href="/docs/plugin/push-modes">modes</a>',
    });

    const result = await checkLinks(tree);

    expect(result.code).toBe(0);
  });

  it('ignores assets and the static search index', async () => {
    const tree = await buildTree({
      'index.html':
        '<a href="/assets/root-abc.js">js</a><a href="/api/search">search</a><a href="/favicon.ico">icon</a>',
    });

    await expect(checkLinks(tree)).resolves.toMatchObject({ code: 0 });
  });

  it('fails loudly when there is no build to check', async () => {
    const result = await checkLinks(join(tmpdir(), 'site-links-does-not-exist'));

    expect(result.code).toBe(1);
    expect(result.output).toContain('no build output');
  });
});
