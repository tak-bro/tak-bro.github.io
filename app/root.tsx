import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigate,
} from 'react-router';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { i18nProvider } from 'fumadocs-ui/i18n';
import type { Route } from './+types/root';
import './app.css';
import { DocsSearchDialog } from './components';
import {
  alternateLinks,
  APP_NAME,
  canonicalUrl,
  CONTENT_ID,
  DOCS_ROUTE_ID_PREFIX,
  homeCopy,
  IS_PROD,
  localeFromPath,
  localeSwitchPath,
  ogLocale,
  translations,
} from './lib';
import NotFound from './routes/not-found';

const NOT_FOUND_ROUTE_IDS = new Set(['not-found', 'not-found-page']);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  // From the path, not useParams: the catch-all 404 has no `lang` param, and an
  // unknown first segment (/nope-x) must not become the document language.
  const lang = localeFromPath(pathname);
  const navigate = useNavigate();
  // Every page is prerendered to its own HTML file, so each gets its own canonical.
  // Trailing slashes are dropped so `/docs/cli/` and `/docs/cli` name one URL.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const canonical = canonicalUrl(path);
  // The /404 page is also served as 404.html for every unknown URL, so it must
  // neither be indexed nor claim a canonical or translated counterpart.
  const matches = useMatches();
  const notFound = matches.some((match) => NOT_FOUND_ROUTE_IDS.has(match.id));
  const docsPage = matches.some((match) => match.id.startsWith(DOCS_ROUTE_ID_PREFIX));

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {notFound ? null : (
          <>
            <link rel="canonical" href={canonical} />
            {alternateLinks(path, lang).map((alternate) => (
              <link
                key={alternate.hreflang}
                rel="alternate"
                hrefLang={alternate.hreflang}
                href={canonicalUrl(alternate.path)}
              />
            ))}
            <meta property="og:url" content={canonical} />
          </>
        )}
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:locale" content={ogLocale(lang)} />
        <meta property="og:image" content={canonicalUrl('/og.png')} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        {/*
          Only the production build may be indexed; a local or preview build is not
          the published site. `og:type` is not here — it differs per route, and
          these literal tags are invisible to <Meta />'s dedup.
        */}
        {IS_PROD && !notFound ? null : <meta name="robots" content="noindex, nofollow" />}
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* The skip link must come before the nav, so only the root can place it. */}
        <a
          href={`#${docsPage ? 'nd-page' : CONTENT_ID}`}
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-fd-foreground px-4 py-2 text-sm font-semibold text-fd-background focus:translate-y-0"
        >
          {homeCopy(lang).skipLabel}
        </a>
        <RootProvider
          search={{ SearchDialog: DocsSearchDialog }}
          i18n={{
            ...i18nProvider(translations, lang),
            // Without this, fumadocs swaps the first path segment for the locale
            // code and sends Korean readers to /ko/docs, which does not exist.
            onLocaleChange: (next) => navigate(localeSwitchPath(pathname, lang, next)),
          }}
        >
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

  const isDevError = import.meta.env.DEV && error instanceof Error;
  const details = isRouteErrorResponse(error)
    ? error.statusText
    : isDevError
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <main className="pt-16 p-4 w-full max-w-[1400px] mx-auto">
      <h1>Error</h1>
      <p>{details}</p>
      {isDevError && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  );
};

const App = () => <Outlet />;

export default App;
