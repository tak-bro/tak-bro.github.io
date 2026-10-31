import { describe, expect, it } from 'vitest';
import { homeCopy } from '../../lib';
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
  it('shows the same work and layers in both languages', () => {
    expect(homeCopy('en').work.map((work) => work.name)).toEqual(homeCopy('ko').work.map((work) => work.name));
    expect(homeCopy('en').layers.map((layer) => layer.source)).toHaveLength(homeCopy('ko').layers.length);
  });

  it('gives every layer an example to show', () => {
    for (const lang of ['ko', 'en']) {
      for (const layer of homeCopy(lang).layers) expect(layer.example.length).toBeGreaterThan(0);
    }
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
