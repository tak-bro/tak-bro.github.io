import { describe, expect, it } from 'vitest';
import { blogPosts, homeCopy } from '../../lib';
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
    // All five guides are written; a card without a docs page would link to a 404.
    expect(call('/').publishedGuides).toEqual(['agent-config', 'workflow', 'herdr', 'keymaps', 'setup']);
    expect(call('/en').publishedGuides).toEqual(['agent-config', 'workflow', 'herdr', 'keymaps', 'setup']);
  });
});

describe('home sections', () => {
  it('shows at most three projects, newest first', () => {
    const projects = call('/').recentProjects;
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.length).toBeLessThanOrEqual(3);
    expect(projects.map((project) => project.date)).toEqual([...projects.map((project) => project.date)].sort().reverse());
    expect(projects[0].url).toMatch(/^\/projects\//);
  });

  it('labels the blog with the years its posts span', () => {
    const dates = blogPosts().map((post) => post.data.date).sort();
    expect(call('/').postYears).toEqual({ first: dates[0].slice(0, 4), last: dates.at(-1)?.slice(0, 4) });
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
