export const APP_NAME = 'Tak';
/** The guides' name in the hero button and on the 404, the same in both languages. */
export const GUIDES_LABEL = "Tak's config";
export const GITHUB_URL = 'https://github.com/tak-bro';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/hyungtak/';
/** The resume in each language. */
export const RESUME_HREF: Record<string, string> = { ko: '/assets/resume.pdf', en: '/assets/resume_eng.pdf' };
export const DOCS_ROUTE = '/docs';
/** Route ids of docs pages start with this; the root aims the skip link at fumadocs' own page. */
export const DOCS_ROUTE_ID_PREFIX = 'docs:';

// Kept in sync by hand with the `dir` literal in source.ts, which the
// fumadocs-mdx macro forbids from being a constant reference.
export const DOCS_CONTENT_DIR = 'content/docs';

/** The `<title>` of a page other than the home, which already names the site. */
export const pageTitle = (title: string): string => `${title} — ${APP_NAME}`;

/** Where the skip link jumps on every page but the docs, whose layout names its own (`nd-page`). */
export const CONTENT_ID = 'content';

/** Route id of the home page in `lang`. */
export const homeRouteId = (lang: string): string => `home-${lang}`;
