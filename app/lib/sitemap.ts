import { alternateLinks, i18n, type AlternateLink } from './i18n';
import { canonicalUrl } from './site';
import { source } from './source';

/** One sitemap entry: the page, when it last changed, and its translations. */
export interface SitemapEntry {
  readonly alternates: readonly AlternateLink[];
  /** Git's, for docs; absent for the homes and docs git has no commit for. */
  readonly lastModified?: Date;
  readonly path: string;
}

const homePath = (lang: string): string => (lang === i18n.defaultLanguage ? '/' : `/${lang}`);

/**
 * Every page the site publishes: homes and docs in every language, each with the
 * same hreflang set its own head carries (root.tsx), so the sitemap cannot offer a
 * translation the page itself does not.
 */
export const sitemapEntries = async (): Promise<SitemapEntry[]> => {
  const homes = i18n.languages.map((lang) => ({
    alternates: alternateLinks(homePath(lang), lang),
    path: homePath(lang),
  }));
  const pages = await Promise.all(
    i18n.languages.flatMap((lang) =>
      source.getPages(lang).map(async (page) => ({
        alternates: alternateLinks(page.url, lang),
        // No commit, no date — not the build time: a lastmod that moves on every
        // deploy teaches crawlers to ignore it.
        lastModified: (await page.data.load()).lastModified ?? undefined,
        path: page.url,
      })),
    ),
  );

  return [...homes, ...pages];
};

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** The sitemap document. `<lastmod>` is the day, which W3C datetime allows. */
export const sitemapXml = (entries: readonly SitemapEntry[]): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map((entry) =>
      [
        '  <url>',
        `    <loc>${escapeXml(canonicalUrl(entry.path))}</loc>`,
        ...(entry.lastModified
          ? [`    <lastmod>${entry.lastModified.toISOString().slice(0, 10)}</lastmod>`]
          : []),
        ...entry.alternates.map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(canonicalUrl(alternate.path))}" />`,
        ),
        '  </url>',
      ].join('\n'),
    ),
    '</urlset>',
    '',
  ].join('\n');
