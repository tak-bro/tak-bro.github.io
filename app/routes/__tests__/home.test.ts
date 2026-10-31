import { describe, expect, it } from 'vitest';
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

  it('lists only guides whose docs page exists', async () => {
    // All seven guides are written; a card without a docs page would link to a 404.
    expect((await call('/')).publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps', 'setup']);
    expect((await call('/en')).publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps', 'setup']);
  });

  it('dates every published guide by its last commit', async () => {
    const { publishedGuides, updated } = await call('/');
    for (const slug of publishedGuides) expect(updated[slug]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('home copy', () => {
  const shape = (lang: string) => {
    const copy = homeCopy(lang);
    return {
      profile: copy.profile?.map((item) => item.href ?? null),
      evidence: copy.evidence?.map((item) => [item.source, item.guide]),
      team: copy.team?.length,
      ladder: copy.ladder?.length,
    };
  };

  it('carries the same sections in the same order in both languages', () => {
    expect(shape('ko').evidence).toBeDefined();
    expect(shape('en')).toEqual(shape('ko'));
  });

  it('backs the claim with exactly three pieces of real output', () => {
    for (const lang of ['ko', 'en']) {
      const evidence = homeCopy(lang).evidence ?? [];
      expect(evidence).toHaveLength(3);
      for (const item of evidence) expect(item.output.length).toBeGreaterThan(0);
    }
  });

  it('lists three things a team can take over and the six enforcement layers', () => {
    for (const lang of ['ko', 'en']) {
      expect(homeCopy(lang).team ?? []).toHaveLength(3);
      expect(homeCopy(lang).ladder ?? []).toHaveLength(6);
    }
  });

  it('points the resume buttons at the page language', () => {
    expect(resumeHref('ko')).toBe('/assets/resume.pdf');
    expect(resumeHref('en')).toBe('/assets/resume_eng.pdf');
  });

  it('links the resume in the page language', () => {
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
