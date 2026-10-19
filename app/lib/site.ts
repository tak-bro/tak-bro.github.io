/**
 * The origin this site is published under, and the absolute URLs built from it.
 *
 * Separate from `shared.ts` because `react-router.config.ts` and everything under
 * `config/` import that file in plain Node, where `import.meta.env` does not exist.
 *
 * No fallback: `vite.config.mts` fails the build when `VITE_SITE_URL` is missing
 * (`config/env.ts`). A default origin here would ship canonical tags pointing at
 * another host.
 */
export const SITE_URL: string = import.meta.env.VITE_SITE_URL;

/**
 * Whether this build is the published site. Only the production build may be
 * indexed; a local build must not compete with it.
 */
export const IS_PROD: boolean = import.meta.env.VITE_ENV === 'PROD';

export const canonicalUrl = (pathname: string): string => new URL(pathname, SITE_URL).href;

// Open Graph wants a territory-qualified locale, which the language code does not carry.
const OG_LOCALES: Record<string, string> = { en: 'en_US', ko: 'ko_KR' };

export const ogLocale = (lang: string): string => OG_LOCALES[lang] ?? OG_LOCALES.ko;
