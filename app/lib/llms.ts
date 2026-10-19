import { canonicalUrl } from './site';
import type { Node } from 'fumadocs-core/page-tree';
import type { InferPageType } from 'fumadocs-core/source';
import { source } from './source';

/**
 * The answer-engine surface (llmstxt.org): `llms.txt` is a titled list of links to
 * each page, `llms-full.txt` is every page's Markdown in one file. One pair per
 * language, each listing that language's pages: loose pages first, then each
 * folder in the page tree's order, which is where `meta.json` order lives.
 */
type Page = InferPageType<typeof source>;

interface Section {
  /** Undefined for pages that sit outside any folder. */
  readonly name: string | undefined;
  readonly pages: Page[];
}

/** The URLs under a list of tree nodes, in reading order. */
const urlsOf = (nodes: readonly Node[]): string[] =>
  nodes.flatMap((node) => {
    if (node.type === 'page') return [node.url];
    if (node.type !== 'folder') return [];

    return [...(node.index ? [node.index.url] : []), ...urlsOf(node.children)];
  });

const sections = (lang: string): Section[] => {
  const byUrl = new Map(source.getPages(lang).map((page) => [page.url, page]));
  const pagesAt = (urls: string[]) => urls.flatMap((url) => byUrl.get(url) ?? []);
  const tree = source.getPageTree(lang).children;
  const loose = pagesAt(tree.flatMap((node) => (node.type === 'page' ? [node.url] : [])));
  const folders = tree.flatMap((node) =>
    node.type === 'folder' ? [{ name: String(node.name), pages: pagesAt(urlsOf([node])) }] : [],
  );

  return [{ name: undefined, pages: loose }, ...folders].filter((section) => section.pages.length > 0);
};

// A link target in Markdown ends at the first `)`; a title ends at the first `]`.
const link = (title: string, url: string): string =>
  `[${title.replace(/([[\]])/g, '\\$1')}](${url.replace(/([()])/g, '\\$1')})`;

/** `llms.txt` for one language: the site, then each page with what it answers. */
export const llmsTxt = (lang: string, site: { title: string; description: string }): string =>
  [
    `# ${site.title}`,
    '',
    `> ${site.description}`,
    '',
    ...sections(lang).flatMap((section) => [
      ...(section.name ? [`## ${section.name}`, ''] : []),
      ...section.pages.map(
        (page) => `- ${link(page.data.title ?? page.url, canonicalUrl(page.url))}: ${page.data.description ?? ''}`,
      ),
      '',
    ]),
  ].join('\n');

/**
 * The body as fumadocs processed it, made to stand on its own outside the site: a
 * relative link to another content file becomes that page's absolute URL, and the
 * `[#id]` fumadocs appends to each heading is dropped. Fenced code is left alone.
 */
const standaloneBody = (body: string, page: Page): string => {
  const rewrite = (prose: string) =>
    prose
      .replace(/(\]\(|href=")(\.{1,2}\/[^)"\s]+)/g, (match, opening: string, href: string) => {
        const resolved = source.resolveHref(href, page);

        return resolved === href ? match : `${opening}${canonicalUrl(resolved)}`;
      })
      .replace(/^(#{1,6} .*?) \[#[^\]]+\]$/gm, '$1');

  // Odd pieces of the split are the fenced blocks themselves.
  return body
    .split(/^(```[\s\S]*?^```)$/m)
    .map((piece, index) => (index % 2 === 0 ? rewrite(piece) : piece))
    .join('')
    .trim();
};

const pageMarkdown = async (page: Page): Promise<string> =>
  [
    `# ${page.data.title}`,
    '',
    `> ${page.data.description}`,
    '',
    `Source: ${canonicalUrl(page.url)}`,
    '',
    standaloneBody(await page.data.getText('processed'), page),
    '',
  ].join('\n');

/** `llms-full.txt` for one language: every page's Markdown in reading order. */
export const llmsFullTxt = async (lang: string): Promise<string> =>
  (await Promise.all(sections(lang).flatMap((section) => section.pages).map(pageMarkdown))).join('\n---\n\n');
