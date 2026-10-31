import { defineI18n } from 'fumadocs-core/i18n';
import { DOCS_ROUTE, RESUME_HREF } from './shared';

// `hideLocale: 'default-locale'` puts Korean at the root and English under /en.
export const i18n = defineI18n({
  defaultLanguage: 'ko',
  hideLocale: 'default-locale',
  languages: ['ko', 'en'],
});

// The default language carries no prefix, so a link built by blindly prepending
// the locale would send Korean readers to /ko/docs, which is not prerendered.
export const localizedDocsHref = (locale: string | undefined): string =>
  !locale || locale === i18n.defaultLanguage ? DOCS_ROUTE : `/${locale}${DOCS_ROUTE}`;

/**
 * Where the language switcher should navigate, keeping the reader on the same page.
 *
 * fumadocs' own I18nProvider has a default handler for this, but it just swaps the
 * first path segment for the locale code and knows nothing about `hideLocale`, so
 * switching to Korean produces /ko/docs — a URL that is never prerendered.
 */
export const localeSwitchPath = (
  pathname: string,
  currentLocale: string,
  nextLocale: string,
): string => {
  const segments = pathname.split('/').filter((segment) => segment.length > 0);

  if (currentLocale !== i18n.defaultLanguage && segments[0] === currentLocale) {
    segments.shift();
  }

  if (nextLocale !== i18n.defaultLanguage) {
    segments.unshift(nextLocale);
  }

  return `/${segments.join('/')}`;
};

type Locale = (typeof i18n.languages)[number];

const isLocale = (value: string): value is Locale =>
  (i18n.languages as readonly string[]).includes(value);

/**
 * The locale a pathname is in, read from its first segment. For routes with no
 * `lang` param — the catch-all 404 — this is the only way to know it.
 */
export const localeFromPath = (pathname: string): string => {
  const first = pathname.split('/').find((segment) => segment.length > 0);

  return first && first !== i18n.defaultLanguage && isLocale(first)
    ? first
    : i18n.defaultLanguage;
};

/**
 * Whether the page at `pathname` exists in every language: the homes and docs do,
 * the blog and projects are Korean only.
 */
export const isLocalizedPath = (pathname: string): boolean => {
  const path = localeSwitchPath(pathname, localeFromPath(pathname), i18n.defaultLanguage);

  return path === '/' || path === DOCS_ROUTE || path.startsWith(`${DOCS_ROUTE}/`);
};

/** One `hreflang` alternate of a page: the same page in another language. */
export interface AlternateLink {
  readonly hreflang: string;
  readonly path: string;
}

/**
 * The page at `pathname` in every language, plus `x-default` naming the default-language one.
 * None for a Korean-only page, which has no translation to point at.
 *
 * Every localized page is prerendered in every language (config/prerender-paths.ts),
 * so the set is the same for each member, which is what keeps the references reciprocal.
 */
export const alternateLinks = (pathname: string, currentLocale: string): AlternateLink[] => {
  if (!isLocalizedPath(pathname)) return [];
  const defaultPath = localeSwitchPath(pathname, currentLocale, i18n.defaultLanguage);

  return [
    ...i18n.languages.map((lang) => ({
      hreflang: lang,
      path: localeSwitchPath(defaultPath, i18n.defaultLanguage, lang),
    })),
    { hreflang: 'x-default', path: defaultPath },
  ];
};

export const resumeHref = (lang: string): string => RESUME_HREF[lang] ?? RESUME_HREF[i18n.defaultLanguage];
