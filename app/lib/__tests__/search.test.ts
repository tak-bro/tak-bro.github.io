import { createFromSource } from 'fumadocs-core/search/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { source } from '../source';

/**
 * The docs site ships no server, so search is a static Orama index emitted at
 * build time and queried in the browser. This exercises the same index builder
 * the build uses, which is where a tokenizer that cannot split Korean would show
 * up — the UI failure mode is an empty result list with no error.
 *
 * Query terms are taken from the content files; the assertions are about which
 * locale's page comes back, not about the wording.
 */
const server = createFromSource(source);

const urlsFor = async (query: string, locale: string): Promise<string[]> => {
  const results = await server.search(query, { locale });

  return results.map((result) => result.url);
};

describe('static search', () => {
  beforeAll(async () => {
    // First query builds the index; do it once so a slow build does not read as
    // a slow assertion.
    await server.search('workflow', { locale: 'en' });
  });

  it('finds the English page from an English term', async () => {
    await expect(urlsFor('workflow', 'en')).resolves.toContain('/en/docs');
  });

  it('finds the Korean page from a Korean term', async () => {
    await expect(urlsFor('워크플로우', 'ko')).resolves.toContain('/docs');
  });

  // Korean is agglutinative, so a reader types 워크플로우를, not the bare noun. The
  // default tokenizer splits on whitespace only and does not strip particles, so
  // this needs a particle-aware tokenizer on both the build index and the browser
  // client. Not built yet: the upstream version of this test passed only because the
  // particle form appeared verbatim in its content.
  it.todo('matches a Korean noun with a particle attached');

  it('keeps locales apart', async () => {
    // Without the locale filter the English page would answer Korean queries and
    // readers would be bounced into the wrong language by the search dialog.
    const koreanResults = await urlsFor('워크플로우', 'ko');
    const englishResults = await urlsFor('workflow', 'en');

    expect(koreanResults.length).toBeGreaterThan(0);
    expect(koreanResults.every((url) => !url.startsWith('/en/'))).toBe(true);
    expect(englishResults.every((url) => url.startsWith('/en/'))).toBe(true);
  });

  it('returns nothing for a term in neither document', async () => {
    await expect(urlsFor('kubernetes', 'en')).resolves.toEqual([]);
  });
});
