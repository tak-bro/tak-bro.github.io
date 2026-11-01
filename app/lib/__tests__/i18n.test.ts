import { describe, expect, it } from 'vitest';
import { alternateLinks, isLocalizedPath, localeFromPath, localeSwitchPath, localizedDocsHref } from '../i18n';

/**
 * URL shape under `hideLocale: 'default-locale'`: Korean is unprefixed, English
 * lives under /en. Both helpers exist because building the URL the obvious way —
 * always prefixing the locale — produces /ko/... , which is never prerendered and
 * so 404s on the host. Expectations are literal paths for that reason.
 */
describe('localizedDocsHref', () => {
  it('leaves the default language unprefixed', () => {
    expect(localizedDocsHref('ko')).toBe('/docs');
    expect(localizedDocsHref(undefined)).toBe('/docs');
  });

  it('prefixes other languages', () => {
    expect(localizedDocsHref('en')).toBe('/en/docs');
  });
});

describe('localeSwitchPath', () => {
  it('drops the prefix when switching to the default language', () => {
    expect(localeSwitchPath('/en/docs', 'en', 'ko')).toBe('/docs');
    expect(localeSwitchPath('/en', 'en', 'ko')).toBe('/');
  });

  it('adds the prefix when leaving the default language', () => {
    expect(localeSwitchPath('/docs', 'ko', 'en')).toBe('/en/docs');
    expect(localeSwitchPath('/', 'ko', 'en')).toBe('/en');
  });

  it('keeps the reader on the same page, not just the same site', () => {
    expect(localeSwitchPath('/docs/herdr/keyboard', 'ko', 'en')).toBe('/en/docs/herdr/keyboard');
    expect(localeSwitchPath('/en/docs/herdr/keyboard', 'en', 'ko')).toBe('/docs/herdr/keyboard');
  });

  it('is a no-op when the language does not change', () => {
    expect(localeSwitchPath('/en/docs', 'en', 'en')).toBe('/en/docs');
    expect(localeSwitchPath('/docs', 'ko', 'ko')).toBe('/docs');
  });
});

describe('alternateLinks', () => {
  // The same set from either member of a pair keeps hreflang references reciprocal.
  const homeSet = [
    { hreflang: 'ko', path: '/' },
    { hreflang: 'en', path: '/en' },
    { hreflang: 'x-default', path: '/' },
  ];
  const docsSet = [
    { hreflang: 'ko', path: '/docs' },
    { hreflang: 'en', path: '/en/docs' },
    { hreflang: 'x-default', path: '/docs' },
  ];

  it('pairs the Korean and English home pages', () => {
    expect(alternateLinks('/', 'ko')).toEqual(homeSet);
    expect(alternateLinks('/en', 'en')).toEqual(homeSet);
  });

  it('pairs a docs page with its translation and points x-default at Korean', () => {
    expect(alternateLinks('/docs', 'ko')).toEqual(docsSet);
    expect(alternateLinks('/en/docs', 'en')).toEqual(docsSet);
  });
});

// Advertising a translation of anything but the homes and docs would point
// crawlers and the language switcher at pages that are never built.
describe('isLocalizedPath', () => {
  it('is true for the homes and docs in either language', () => {
    for (const path of ['/', '/en', '/en/', '/docs', '/docs/', '/docs/herdr', '/en/docs/', '/en/docs/herdr/keys']) {
      expect(isLocalizedPath(path), path).toBe(true);
    }
  });

  it('is false for paths outside the homes and docs, and look-alikes', () => {
    for (const path of ['/blog', '/blog/eos-tutorial', '/projects', '/projects/suji', '/docsx', '/en/blog']) {
      expect(isLocalizedPath(path), path).toBe(false);
    }
  });

  it('gives a path outside the homes and docs no alternates', () => {
    expect(alternateLinks('/blog/eos-tutorial', 'ko')).toEqual([]);
    expect(alternateLinks('/projects', 'ko')).toEqual([]);
  });
});

describe('localeFromPath', () => {
  it('reads a non-default locale prefix and falls back to the default', () => {
    expect(localeFromPath('/en/nope-x')).toBe('en');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/nope-x')).toBe('ko');
    expect(localeFromPath('/english/page')).toBe('ko');
    expect(localeFromPath('/')).toBe('ko');
  });
});
