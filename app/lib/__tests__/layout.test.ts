import { describe, expect, it } from 'vitest';
import { baseOptions } from '../layout.shared';

const links = (lang: string) =>
  (baseOptions({ lang }).links ?? []).map((link) => ('url' in link ? [link.text, link.url] : undefined));

describe('baseOptions', () => {
  it('links the guides in the page language and GitHub, not the blog or projects', () => {
    expect(links('ko')).toEqual([['가이드', '/docs'], ['GitHub', 'https://github.com/tak-bro']]);
    expect(links('en')).toEqual([['Guides', '/en/docs'], ['GitHub', 'https://github.com/tak-bro']]);
  });

  // No English page to switch to, so the switcher would lead to a 404.
  it('hides the language switcher on a Korean-only page', () => {
    expect(baseOptions({ localized: false }).i18n).toBe(false);
    expect(baseOptions({ lang: 'en' }).i18n).not.toBe(false);
  });
});
