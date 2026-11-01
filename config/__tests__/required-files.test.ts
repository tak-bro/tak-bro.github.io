import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const script = (name: string) => fileURLToPath(new URL(`../../scripts/${name}`, import.meta.url));

const runScript = async (name: string, buildDir: string) =>
  run(process.execPath, [script(name)], { env: { ...process.env, SITE_BUILD_DIR: buildDir } })
    .then(({ stdout }) => ({ code: 0, output: stdout }))
    .catch((error: { code?: number; stdout?: string; stderr?: string }) => ({
      code: error.code ?? 1,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    }));

const COMPLETE = {
  'index.html': 'home',
  '404.html': 'not found',
  'assets/resume.pdf': '%PDF',
  'assets/resume_eng.pdf': '%PDF',
};

/**
 * /assets/resume.pdf is linked from outside this site, so the build must keep
 * emitting it; GitHub Pages also needs a top-level 404.html. Both scripts run as
 * shipped, against a fixture build tree.
 */
describe('build output gates', () => {
  let dir: string | undefined;

  const buildTree = async (files: Record<string, string>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-required-'));
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

  describe('check-required-files', () => {
    it('passes when every required file was emitted', async () => {
      const result = await runScript('check-required-files.mjs', await buildTree(COMPLETE));

      expect(result.code).toBe(0);
    });

    it.each(Object.keys(COMPLETE))('fails and names %s when it is missing', async (missing) => {
      const { [missing]: _omitted, ...rest } = COMPLETE as Record<string, string>;
      const result = await runScript('check-required-files.mjs', await buildTree(rest));

      expect(result.code).toBe(1);
      expect(result.output).toContain(missing);
    });

    it('fails on an empty file', async () => {
      const result = await runScript('check-required-files.mjs', await buildTree({ ...COMPLETE, 'assets/resume.pdf': '' }));

      expect(result.code).toBe(1);
      expect(result.output).toContain('assets/resume.pdf');
    });
  });

  describe('write-404', () => {
    it('copies the prerendered /404 page to 404.html, holding the router at /404 until hydration', async () => {
      const tree = await buildTree({ '404/index.html': '<html><head><title>x</title></head><h1>missing</h1></html>' });

      await expect(runScript('write-404.mjs', tree)).resolves.toMatchObject({ code: 0 });
      const html = await readFile(join(tree, '404.html'), 'utf8');
      expect(html).toMatch(/^<html><head><script>.*window\.__notFoundPath=.*replaceState\(history\.state,"","\/404"\).*<\/script><title>x<\/title>/);
      expect(html).toContain('<h1>missing</h1>');
    });

    it('fails when the /404 page has no <head> to hold the script', async () => {
      const result = await runScript('write-404.mjs', await buildTree({ '404/index.html': '<h1>missing</h1>' }));

      expect(result.code).toBe(1);
      expect(result.output).toContain('no <head>');
    });

    it('fails when /404 was not prerendered', async () => {
      const result = await runScript('write-404.mjs', await buildTree({ 'index.html': 'home' }));

      expect(result.code).toBe(1);
      expect(result.output).toContain('404/index.html');
    });
  });
});
