export const APP_NAME = 'Tak';
export const GITHUB_URL = 'https://github.com/tak-bro';
export const DOCS_ROUTE = '/docs';
/** Route ids of docs pages start with this; the root aims the skip link at fumadocs' own page. */
export const DOCS_ROUTE_ID_PREFIX = 'docs:';

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

/** Where the skip link jumps on every page but the docs, whose layout names its own (`nd-page`). */
export const CONTENT_ID = 'content';

/** WebP copies written next to each project screenshot in public/: full size, and an 800px card. */
export const screenshotWebp = (src: string): string => src.replace(/\.png$/, '.webp');
export const screenshotThumb = (src: string): string => src.replace(/\.png$/, '.thumb.webp');

/** Route id of the home page in `lang`. */
export const homeRouteId = (lang: string): string => `home-${lang}`;
