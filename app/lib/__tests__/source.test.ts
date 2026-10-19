import { describe, expect, it } from 'vitest';
import { listMdxFiles } from '../../../config';
import { BLOG_CONTENT_DIR, PROJECTS_CONTENT_DIR } from '../shared';
import { blogSource, projectsSource, source } from '../source';

// `source` is the pinned seam: routing, prerendering and the search index all
// read page identity from it. Expectations are written as literals on purpose —
// asserting against DOCS_ROUTE would compare the code to itself and stay green
// even if the base url changed underneath.
describe('source', () => {
  it('maps the content root to /docs', () => {
    const page = source.getPage([]);

    expect(page).toBeDefined();
    expect(page?.url).toBe('/docs');
  });

  it('exposes frontmatter as page data', () => {
    const page = source.getPage([]);

    expect(page?.data.title).toBe('소개');
  });

  it('returns unknown slugs as undefined rather than throwing', () => {
    expect(source.getPage(['no', 'such', 'page'])).toBeUndefined();
  });

  it('builds a page tree that contains every page it can resolve', () => {
    const urls = source.getPages().map((page) => page.url);

    expect(urls).toContain('/docs');
    expect(source.getPageTree().children.length).toBeGreaterThan(0);
  });

  // The `dir` literals in source.ts cannot reference these constants (fumadocs-mdx
  // macro), and routes.ts builds one route per file from the constants.
  it('reads the same files the routes are built from', async () => {
    expect(blogSource.getPages()).toHaveLength((await listMdxFiles(BLOG_CONTENT_DIR)).length);
    expect(projectsSource.getPages()).toHaveLength((await listMdxFiles(PROJECTS_CONTENT_DIR)).length);
  });
});
