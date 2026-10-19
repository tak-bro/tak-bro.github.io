import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const SCRIPT = fileURLToPath(new URL('../../scripts/check-sensitive.mjs', import.meta.url));

const checkSensitive = async (args: string[], env: Record<string, string> = {}) =>
  run(process.execPath, [SCRIPT, ...args], { env: { ...process.env, ...env } })
    .then(({ stdout }) => ({ code: 0, output: stdout }))
    .catch((error: { code?: number; stdout?: string; stderr?: string }) => ({
      code: error.code ?? 1,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    }));

/**
 * The repo is public and its config snippets come from private repos, so the
 * gate must catch work identity, local paths, and credential shapes, while not
 * failing on binaries like the resume PDF (which names a past employer).
 */
describe('check-sensitive', () => {
  let dir: string | undefined;

  const tree = async (files: Record<string, string | Buffer>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-sensitive-'));
    for (const [path, body] of Object.entries(files)) {
      await mkdir(join(dir, path, '..'), { recursive: true });
      await writeFile(join(dir, path), body);
    }

    return dir;
  };

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('passes clean text', async () => {
    const root = await tree({ 'a.md': 'nothing to see\n' });

    await expect(checkSensitive([root])).resolves.toMatchObject({ code: 0 });
  });

  it.each([
    ['work email', 'mail someone@lemoncloud.io'],
    ['work GitHub account', 'gh auth switch -u louis-lemon'],
    ['company name in any case', 'LemonCloud platform'],
    ['home directory path', 'source /Users/tak/.zshrc'],
    ['GitHub classic token', 'token = ghp_abcdefghijklmnopqrstuvwxyz0123456789'],
    ['GitHub fine-grained token', 'github_pat_11ABCDEFG0123456789_abcdef'],
    ['Anthropic key', 'ANTHROPIC_API_KEY=sk-ant-api03-xyz'],
    ['AWS access key', 'aws_access_key_id = AKIAABCDEFGHIJKLMNOP'],
    ['private key', '-----BEGIN OPENSSH PRIVATE KEY-----'],
  ])('fails on a %s and names the file and line', async (_name, line) => {
    const root = await tree({ 'clean.md': 'ok\n', 'nested/leak.toml': `first\n${line}\n` });
    const result = await checkSensitive([root]);

    expect(result.code).toBe(1);
    expect(result.output).toContain('nested/leak.toml:2');
    expect(result.output).not.toContain('clean.md');
  });

  it('skips binary files', async () => {
    const pdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.from([0, 1, 2]), Buffer.from('LemonCloud')]);
    const root = await tree({ 'resume.pdf': pdf });

    await expect(checkSensitive([root])).resolves.toMatchObject({ code: 0 });
  });

  it('scans the target of a symlinked file', async () => {
    const outside = await mkdtemp(join(tmpdir(), 'site-sensitive-outside-'));
    try {
      await writeFile(join(outside, 'leak.md'), 'someone@lemoncloud.io\n');
      const root = await tree({ 'clean.md': 'ok\n' });
      await symlink(join(outside, 'leak.md'), join(root, 'linked.md'));

      const result = await checkSensitive([root]);

      expect(result.code).toBe(1);
      expect(result.output).toContain('linked.md:1');
    } finally {
      await rm(outside, { recursive: true, force: true });
    }
  });

  it('honors an allow entry for one file and pattern only', async () => {
    const root = await tree({ 'ok.md': 'lemoncloud\n', 'bad.md': 'lemoncloud\n' });
    const allow = join(root, 'allow.json');
    await writeFile(allow, JSON.stringify([{ file: join(root, 'ok.md'), pattern: 'lemoncloud' }]));

    const result = await checkSensitive([join(root, 'ok.md'), join(root, 'bad.md')], { SENSITIVE_ALLOW: allow });

    expect(result.code).toBe(1);
    expect(result.output).toContain('bad.md');
    expect(result.output).not.toContain('ok.md');
  });

  it('fails loudly when a target does not exist', async () => {
    const result = await checkSensitive([join(tmpdir(), 'site-sensitive-does-not-exist')]);

    expect(result.code).toBe(1);
    expect(result.output).toContain('does-not-exist');
  });
});
