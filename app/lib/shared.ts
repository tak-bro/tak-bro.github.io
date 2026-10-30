export const APP_NAME = 'Tak';
export const GITHUB_URL = 'https://github.com/tak-bro';
export const DOCS_ROUTE = '/docs';

// Kept in sync by hand with the `dir` literal in source.ts, which the
// fumadocs-mdx macro forbids from being a constant reference.
export const DOCS_CONTENT_DIR = 'content/docs';

// Korean only: the blog has no /en counterpart.
export const BLOG_ROUTE = '/blog';
// Kept in sync by hand with the `dir` literal in source.ts.
export const BLOG_CONTENT_DIR = 'content/blog';

export const PROJECTS_ROUTE = '/projects';
// Kept in sync by hand with the `dir` literal in source.ts.
export const PROJECTS_CONTENT_DIR = 'content/projects';

/** The `<title>` of a page other than the home, which already names the site. */
export const pageTitle = (title: string): string => `${title} — ${APP_NAME}`;

/** Route id of the home page in `lang`; the root keys the skip link on it. */
export const homeRouteId = (lang: string): string => `home-${lang}`;
