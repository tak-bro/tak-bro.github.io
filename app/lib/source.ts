import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { frontmatterSchema } from './frontmatter';
import { i18n } from './i18n';
import { DOCS_ROUTE } from './shared';

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
