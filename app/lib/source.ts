import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { blogFrontmatterSchema, frontmatterSchema, projectFrontmatterSchema } from './frontmatter';
import { i18n } from './i18n';
import { BLOG_ROUTE, DOCS_ROUTE, PROJECTS_ROUTE } from './shared';

export const docs = defineDocs({
  // Must stay a string literal — fumadocs-mdx resolves it at build time to
  // decide how content is bundled, so a constant reference fails the macro.
  dir: 'content/docs',
  docs: {
    async: true,
    // Git author date of each file's latest commit, for the sitemap's <lastmod>.
    lastModified: true,
    schema: frontmatterSchema,
    // Keeps each page's Markdown for llms-full.txt.
    postprocess: { includeProcessedMarkdown: true },
  },
});

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: DOCS_ROUTE,
  i18n,
});

export const blog = defineDocs({
  // String literal for the same reason as `docs` above.
  dir: 'content/blog',
  docs: {
    async: true,
    schema: blogFrontmatterSchema,
  },
});

/** Korean only, so no i18n: every post has one URL, /blog/<slug>. */
export const blogSource = loader({
  source: blog.toFumadocsSource(),
  baseUrl: BLOG_ROUTE,
});

/** Newest first. */
export const blogPosts = () => [...blogSource.getPages()].sort((a, b) => b.data.date.localeCompare(a.data.date));

export const projects = defineDocs({
  // String literal for the same reason as `docs` above.
  dir: 'content/projects',
  docs: {
    async: true,
    schema: projectFrontmatterSchema,
  },
});

/** Korean only, like the blog: /projects/<name>. */
export const projectsSource = loader({
  source: projects.toFumadocsSource(),
  baseUrl: PROJECTS_ROUTE,
});

/** Newest first. */
export const projectPages = () => [...projectsSource.getPages()].sort((a, b) => b.data.date.localeCompare(a.data.date));
