import { describe, expect, it } from 'vitest';
import { plainEndings } from '../../../scripts/korean-tone.mjs';
import { homeCopy, resumeHref } from '../../lib';
import { loader } from '../home';

type LoaderArgs = Parameters<typeof loader>[0];

const call = (pathname: string) =>
  loader({ request: new Request(`https://example.test${pathname}`) } as LoaderArgs);

describe('home loader', () => {
  it('takes the language from the path', async () => {
    expect((await call('/')).lang).toBe('ko');
    expect((await call('/en')).lang).toBe('en');
  });
});

describe('home copy', () => {
  const shape = (lang: string) => {
    const copy = homeCopy(lang);
    return {
      guides: Object.keys(copy.guideTitles),
      links: copy.links.map((link) => [link.icon, link.href.startsWith('/assets/') ? 'resume' : link.href]),
    };
  };

  it('carries the same guides and links in the same order in both languages', () => {
    expect(shape('ko').guides).toHaveLength(7);
    expect(shape('en')).toEqual(shape('ko'));
  });

  it('points the resume links at the page language', () => {
    expect(resumeHref('ko')).toBe('/assets/resume.pdf');
    expect(resumeHref('en')).toBe('/assets/resume_eng.pdf');
    const resume = (lang: string) => homeCopy(lang).links.find((link) => link.href.startsWith('/assets/'))?.href;
    expect(resume('ko')).toBe('/assets/resume.pdf');
    expect(resume('en')).toBe('/assets/resume_eng.pdf');
  });
});

describe('home loader on a data request', () => {
  it('reads the language the same way as for the document', async () => {
    expect((await call('/en.data')).lang).toBe('en');
    expect((await call('/_.data')).lang).toBe('ko');
  });
});

// Every string the Korean home shows, walked out of the copy object.
const strings = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];

describe('Korean home copy', () => {
  // The site speaks 해요체 (SITE-BRIEF); scripts/check-guides.mjs reads only content/docs, so the home is checked here.
  it('ends no sentence in the plain form', () => {
    expect(plainEndings(strings(homeCopy('ko')).join('\n'))).toEqual([]);
  });
});
