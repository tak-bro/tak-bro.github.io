import { index, route, type RouteConfig } from '@react-router/dev/routes';
// By file, not through app/lib's barrel: this runs in plain Node, where the
// barrel's source.ts (`defineDocs` macro) does not resolve.
import { docsPrerenderPaths, listMdxFiles } from '../config';
import { i18n } from './lib/i18n';
import { BLOG_CONTENT_DIR, BLOG_ROUTE, DOCS_CONTENT_DIR, DOCS_ROUTE_ID_PREFIX, homeRouteId, PROJECTS_CONTENT_DIR, PROJECTS_ROUTE } from './lib/shared';

// One static route per real page: in a static build a pattern route (`:lang?`,
// `docs/*`) has no loader data for unknown URLs, so those must reach the 404.
const homeRoutes = i18n.languages.map((lang) =>
  lang === i18n.defaultLanguage
    ? index('routes/home.tsx', { id: homeRouteId(lang) })
    : route(lang, 'routes/home.tsx', { id: homeRouteId(lang) }),
);

const docsRoutes = async () =>
  docsPrerenderPaths(await listMdxFiles(DOCS_CONTENT_DIR)).map((path) =>
    route(path.slice(1), 'routes/docs.tsx', { id: `${DOCS_ROUTE_ID_PREFIX}${path}` }),
  );

// A list page plus one route per file, for the Korean-only collections.
const collectionRoutes = async (base: string, contentDir: string, list: string, page: string) => [
  route(base.slice(1), list),
  ...(await listMdxFiles(contentDir)).map((file) => {
    const slug = file.slice(0, -'.mdx'.length);
    return route(`${base.slice(1)}/${slug}`, page, { id: `${base.slice(1)}:${slug}` });
  }),
];

export default (async () => [
  // The resource routes are static segments; each is prerendered to a file.
  route('api/search', 'routes/search.ts'),
  route('robots.txt', 'routes/robots.ts'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route('llms.txt', 'routes/llms.ts', { id: 'llms-ko' }),
  route('llms-full.txt', 'routes/llms.ts', { id: 'llms-full-ko' }),
  route('en/llms.txt', 'routes/llms.ts', { id: 'llms-en' }),
  route('en/llms-full.txt', 'routes/llms.ts', { id: 'llms-full-en' }),

  ...homeRoutes,
  ...(await docsRoutes()),
  ...(await collectionRoutes(BLOG_ROUTE, BLOG_CONTENT_DIR, 'routes/blog.tsx', 'routes/blog-post.tsx')),
  ...(await collectionRoutes(PROJECTS_ROUTE, PROJECTS_CONTENT_DIR, 'routes/projects.tsx', 'routes/project.tsx')),

  // Prerendered and copied to 404.html (scripts/write-404.mjs) for GitHub Pages;
  // the catch-all below cannot be prerendered.
  route('404', 'routes/not-found.tsx', { id: 'not-found-page' }),
  route('*', 'routes/not-found.tsx', { id: 'not-found' }),
])() satisfies RouteConfig;
