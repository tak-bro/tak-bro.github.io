import { describe, expect, it } from 'vitest';
import { homeCopy } from '../../lib';
import { loader } from '../home';

type LoaderArgs = Parameters<typeof loader>[0];

const call = (pathname: string) =>
  loader({ request: new Request(`https://example.test${pathname}`) } as LoaderArgs);

describe('home loader', () => {
  it('takes the language from the path', () => {
    expect(call('/').lang).toBe('ko');
    expect(call('/en').lang).toBe('en');
  });

  it('lists only guides whose docs page exists', () => {
    // All seven guides are written; a card without a docs page would link to a 404.
    expect(call('/').publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps', 'setup']);
    expect(call('/en').publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps', 'setup']);
  });
});

describe('home copy', () => {
  it('puts every guide in one of the two groups', () => {
    for (const lang of ['ko', 'en']) {
      const copy = homeCopy(lang);
      const grouped = copy.guideGroups.flatMap((group) => copy.guides.filter((guide) => guide.group === group.id));
      expect(grouped.map((guide) => guide.slug)).toEqual(copy.guides.map((guide) => guide.slug));
    }
  });

  it('walks the same /orch stages in both languages', () => {
    expect(homeCopy('en').stages).toHaveLength(homeCopy('ko').stages.length);
  });

  it('links the resume in the page language', () => {
    expect(homeCopy('ko').resumeHref).toBe('/assets/resume.pdf');
    expect(homeCopy('en').resumeHref).toBe('/assets/resume_eng.pdf');
  });
});

describe('home loader on a data request', () => {
  it('reads the language the same way as for the document', () => {
    expect(call('/en.data').lang).toBe('en');
    expect(call('/_.data').lang).toBe('ko');
  });
});
