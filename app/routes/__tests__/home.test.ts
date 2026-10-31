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

  it('lists the three newest posts from the listed range, newest first', async () => {
    const { posts } = await call('/');
    expect(posts).toHaveLength(3);
    for (const post of posts) expect(post.date >= '2026-01-01').toBe(true);
    expect(posts.map((post) => post.date)).toEqual([...posts.map((post) => post.date)].sort().reverse());
  });

  it('lists only the agent-side projects, with the statusline output to print', async () => {
    const { projects, sample } = await call('/');
    expect(projects.map((project) => project.url).sort()).toEqual(
      ['agent-config', 'aicommit2', 'hwip', 'pi-statusline', 'tak-cc-statusline'].map((name) => `/projects/${name}`),
    );
    expect(sample?.length).toBeGreaterThan(0);
  });

  it('shows the same posts and projects in both languages', async () => {
    const [ko, en] = await Promise.all([call('/'), call('/en')]);
    expect(en.posts).toEqual(ko.posts);
    expect(en.projects).toEqual(ko.projects);
  });

  it('lists only guides whose docs page exists', async () => {
    // All six guides are written; a row without a docs page would link to a 404.
    expect((await call('/')).publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps']);
    expect((await call('/en')).publishedGuides).toEqual(['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps']);
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
      guides: copy.guides.map((guide) => guide.slug),
      links: copy.links.map((link) => (link.href.startsWith('/assets/') ? 'resume' : link.href)),
    };
  };

  it('carries the same guides and links in the same order in both languages', () => {
    expect(shape('ko').guides).toHaveLength(6);
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
