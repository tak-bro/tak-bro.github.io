import { describe, expect, it } from 'vitest';
import { baseOptions } from '../layout.shared';

const links = (lang: string) =>
  (baseOptions({ lang }).links ?? []).map((link) => ('url' in link ? [link.text, link.url] : undefined));

describe('baseOptions', () => {
  it('links only the guides, in the page language', () => {
    expect(links('ko')).toEqual([["Tak's config", '/docs']]);
    expect(links('en')).toEqual([["Tak's config", '/en/docs']]);
  });

  // No English page to switch to, so the switcher would lead to a 404.
  it('hides the language switcher on a page with no translation', () => {
    expect(baseOptions({ localized: false }).i18n).toBe(false);
    expect(baseOptions({ lang: 'en' }).i18n).not.toBe(false);
  });
});
