import { describe, expect, it } from 'vitest';
import { baseOptions } from '../layout.shared';

const links = (lang: string) =>
  (baseOptions({ lang }).links ?? []).map((link) => ('url' in link ? [link.text, link.url] : undefined));

describe('baseOptions', () => {
  it('links the posts, projects, guides and resume in the page language, then GitHub', () => {
    const github = ['GitHub', 'https://github.com/tak-bro'];
    expect(links('ko')).toEqual([['글', '/blog'], ['프로젝트', '/projects'], ['가이드', '/docs'], ['이력서', '/assets/resume.pdf'], github]);
    expect(links('en')).toEqual([['Posts', '/blog'], ['Projects', '/projects'], ['Guides', '/en/docs'], ['Resume', '/assets/resume_eng.pdf'], github]);
  });

  // No English page to switch to, so the switcher would lead to a 404.
  it('hides the language switcher on a Korean-only page', () => {
    expect(baseOptions({ localized: false }).i18n).toBe(false);
    expect(baseOptions({ lang: 'en' }).i18n).not.toBe(false);
  });
});
