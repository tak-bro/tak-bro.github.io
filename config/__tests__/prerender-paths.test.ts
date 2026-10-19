import { describe, expect, it } from 'vitest';
import { docsPrerenderPaths } from '../prerender-paths';

/**
 * Every URL this misses is a page that builds fine and then 404s in production,
 * because prerendering is the only thing that writes an HTML key for it.
 *
 * Expectations are literal URLs, taken from the `hideLocale: 'default-locale'`
 * contract (Korean unprefixed, everything else prefixed) rather than recomputed
 * from the i18n config — comparing the code to itself would pass no matter what
 * the base url or the locale rule became.
 */
describe('docsPrerenderPaths', () => {
  it('emits every language for a page, even one with no translation file', () => {
    // fumadocs falls back to the default language for a missing translation, so
    // /en/docs exists and gets indexed for search whether or not index.en.mdx
    // does. Prerendering only the translated files makes those search hits 404.
    expect(docsPrerenderPaths(['index.mdx'])).toEqual(['/docs', '/en/docs']);
  });

  it('does not duplicate a page that does have a translation', () => {
    expect(docsPrerenderPaths(['index.mdx', 'index.en.mdx'])).toEqual(['/docs', '/en/docs']);
  });

  it('keeps nested pages under their folder', () => {
    expect(docsPrerenderPaths(['herdr/keyboard.mdx'])).toEqual(['/docs/herdr/keyboard', '/en/docs/herdr/keyboard']);
  });

  it('covers a folder index page', () => {
    expect(docsPrerenderPaths(['herdr/index.mdx'])).toEqual(['/docs/herdr', '/en/docs/herdr']);
  });

  it('does not treat the default locale as a suffix', () => {
    // Korean is unsuffixed, so a stray index.ko.mdx is a page named "index.ko".
    expect(docsPrerenderPaths(['index.ko.mdx'])).toEqual(['/docs/index.ko', '/en/docs/index.ko']);
  });

  it('does not treat an unknown suffix as a locale', () => {
    // `.md` is not in i18n.languages; the segment stays part of the page name.
    expect(docsPrerenderPaths(['release.md.mdx'])).toEqual([
      '/docs/release.md',
      '/en/docs/release.md',
    ]);
  });
});
