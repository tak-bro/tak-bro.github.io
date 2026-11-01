// schema.org JSON-LD for search engines: who the site is by, and where each guide sits.
import { localizedDocsHref } from './i18n';
import { canonicalUrl } from './site';
import { APP_NAME, GITHUB_URL, GUIDES_LABEL, LINKEDIN_URL } from './shared';

export type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

const person = (): JsonLd => ({
  '@type': 'Person',
  name: APP_NAME,
  alternateName: ['Hyungtak Jin', '진형탁'],
  url: canonicalUrl('/'),
  sameAs: [LINKEDIN_URL, GITHUB_URL],
});

/** The home: the person, so a search for the name lands on the profile links. */
export const personLd = (): JsonLd => ({ '@context': CONTEXT, ...person() });

interface Guide {
  readonly title: string;
  readonly description: string;
  readonly lang: string;
  readonly path: string;
  readonly lastModified?: Date;
}

/** A guide: the article, and its place under the guides' index. */
export const guideLd = (guide: Guide): JsonLd => {
  const url = canonicalUrl(guide.path);
  const article: JsonLd = {
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.description,
    inLanguage: guide.lang,
    url,
    author: person(),
    ...(guide.lastModified ? { dateModified: guide.lastModified.toISOString() } : {}),
  };
  const index = canonicalUrl(localizedDocsHref(guide.lang));
  // The index itself gets no breadcrumb.
  const isIndex = index === url;
  const breadcrumb: JsonLd = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: GUIDES_LABEL, item: index },
      { '@type': 'ListItem', position: 2, name: guide.title, item: url },
    ],
  };
  return { '@context': CONTEXT, '@graph': isIndex ? [article] : [article, breadcrumb] };
};

/** The script body: `<` escaped so no string in the data can close the tag. */
export const jsonLdScript = (data: JsonLd): string => JSON.stringify(data).replace(/</g, '\\u003c');
