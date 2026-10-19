import { index, route, type RouteConfig } from '@react-router/dev/routes';
// By file, not through app/lib's barrel: this runs in plain Node, where the
// barrel's source.ts (`defineDocs` macro) does not resolve.
import { docsPrerenderPaths, listMdxFiles } from '../config';
import { i18n } from './lib/i18n';
import { DOCS_CONTENT_DIR } from './lib/shared';

// Only real pages get a route; there is no `:lang?` segment and no `docs/*`
// splat. The build is static (`ssr: false`), so a URL that was not prerendered
// has no loader data, and a pattern route with a loader would render a data
// error for a typo (/nope-x, /docs/nope). Unknown paths reach the catch-all 404.
// Korean (the default) is unprefixed, English lives under /en.
const homeRoutes = i18n.languages.map((lang) =>
  lang === i18n.defaultLanguage
    ? index('routes/home.tsx', { id: `home-${lang}` })
    : route(lang, 'routes/home.tsx', { id: `home-${lang}` }),
);

const docsRoutes = async () =>
  docsPrerenderPaths(await listMdxFiles(DOCS_CONTENT_DIR)).map((path) =>
    route(path.slice(1), 'routes/docs.tsx', { id: `docs:${path}` }),
  );

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

  // Prerendered and copied to 404.html (scripts/write-404.mjs) for GitHub Pages;
  // the catch-all below cannot be prerendered.
  route('404', 'routes/not-found.tsx', { id: 'not-found-page' }),
  route('*', 'routes/not-found.tsx', { id: 'not-found' }),
])() satisfies RouteConfig;
