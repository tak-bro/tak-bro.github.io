import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight } from 'lucide-react';
import { use, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { PageHeader, primaryButton } from '../components';
import { baseOptions, CONTENT_ID, i18n, isLocalizedPath, localeFromPath, localizedDocsHref, NotFoundPathContext, takeNotFoundPath, type NotFoundHold } from '../lib';

declare global {
  /** 404.html swaps the visitor's address for /404 so the page hydrates as rendered. */
  interface Window extends NotFoundHold {}
}

const COPY: Record<string, { title: string; body: string; home: string; guides: string }> = {
  ko: { title: '없는 페이지다', body: '주소가 바뀌었거나 지워졌다.', home: '홈으로', guides: '가이드' },
  en: { title: 'This page does not exist', body: 'The address changed or the page was removed.', home: 'Home', guides: 'Guides' },
};

const notFoundCopy = (lang: string) => COPY[lang] ?? COPY[i18n.defaultLanguage];

// Rendered from root.tsx's ErrorBoundary as well as the catch-all route, which has
// no `lang` param, so the locale comes from the path itself.
const NotFound = () => {
  const { pathname } = useLocation();
  const { heldPath, holdPath } = use(NotFoundPathContext);
  const path = heldPath ?? pathname;

  // After hydration, put the visitor's own address back. The router stays on /404 (it matches
  // paths case-insensitively and a host 404 like /DOCS/x must not become /docs/x); the root takes
  // the held path for the document language, the title and the skip link.
  useEffect(() => {
    const restored = takeNotFoundPath(window, window.location.origin);
    if (!restored) return;
    window.history.replaceState(window.history.state, '', restored);
    holdPath(new URL(restored, window.location.origin).pathname);
  }, [holdPath]);

  const lang = localeFromPath(path);
  const copy = notFoundCopy(lang);

  return (
    <HomeLayout {...baseOptions({ lang, localized: isLocalizedPath(path) })}>
      <title>{copy.title}</title>
      <section id={CONTENT_ID} className="home-frame flex flex-1 flex-col justify-center py-24">
        <PageHeader title={copy.title} description={copy.body}>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to={lang === i18n.defaultLanguage ? '/' : `/${lang}`} className={`${primaryButton} min-h-11`}>
              {copy.home}
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
            <Link to={localizedDocsHref(lang)} className="home-link text-[15px] font-medium">
              <span>{copy.guides}</span>
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </PageHeader>
      </section>
    </HomeLayout>
  );
};

export default NotFound;
