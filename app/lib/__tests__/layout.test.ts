import { describe, expect, it } from 'vitest';
import { baseOptions } from '../layout.shared';

const linkTexts = (options: ReturnType<typeof baseOptions>) =>
  (options.links ?? []).map((link) => ('text' in link ? link.text : undefined));

describe('baseOptions', () => {
  it('links the Korean-only blog and projects, labelled as Korean on English pages', () => {
    expect(linkTexts(baseOptions({ lang: 'ko' }))).toEqual(['블로그', '프로젝트', 'GitHub']);
    expect(linkTexts(baseOptions({ lang: 'en' }))).toEqual(['Blog (Korean)', 'Projects (Korean)', 'GitHub']);
  });

  // No English page to switch to, so the switcher would lead to a 404.
  it('hides the language switcher on a Korean-only page', () => {
    expect(baseOptions({ localized: false }).i18n).toBe(false);
    expect(baseOptions({ lang: 'en' }).i18n).not.toBe(false);
  });
});
