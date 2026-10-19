import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { listMdxFiles } from '../content-files';
import { DOCS_CONTENT_DIR } from '../../app/lib/shared';

// DOCS_CONTENT_DIR is relative to the app root, which is where react-router runs.
// Resolved against this file, not the process cwd, so vitest can run from anywhere.
const contentDir = fileURLToPath(new URL(`../../${DOCS_CONTENT_DIR}`, import.meta.url));

/**
 * Cross-page links in MDX must be relative (`./commands.mdx`), never absolute
 * (`/docs/cli/commands`).
 *
 * resolveDocsHref rewrites a relative link through the loader, so it resolves to
 * /docs/... on a Korean page and /en/docs/... on an English one. An absolute
 * link is emitted verbatim, which silently drops an English reader back into
 * Korean — the page still loads, so nothing looks broken.
 */
describe('content links', () => {
  it('uses relative links between doc pages', async () => {
    const files = await listMdxFiles(contentDir);

    const offenders: string[] = [];

    for (const file of files) {
      const body = await readFile(join(contentDir, file), 'utf8');

      for (const match of body.matchAll(/]\((\/(?:en\/)?docs[^)]*)\)/g)) {
        offenders.push(`${file}: ${match[1]}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  // A relative link must name the content file (`./encryption.mdx`): resolveDocsHref
  // looks it up by file path, and the prerender fails on one it cannot find.
  it('names the content file in relative links', async () => {
    const files = await listMdxFiles(contentDir);
    const offenders: string[] = [];

    for (const file of files) {
      const prose = (await readFile(join(contentDir, file), 'utf8')).replace(/^```[\s\S]*?^```/gm, '');

      for (const match of prose.matchAll(/(?:]\(|href=")(\.{1,2}\/[^)"\s#]*)/g)) {
        if (!match[1].endsWith('.mdx')) offenders.push(`${file}: ${match[1]}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
