import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { PageHeader, primaryButton } from '../components';
import { baseOptions, CONTENT_ID, i18n, isLocalizedPath, localeFromPath, localizedDocsHref } from '../lib';

declare global {
  interface Window {
    /** The address a visitor asked for; 404.html swaps it for /404 so the page hydrates as rendered. */
    __notFoundPath?: string;
  }
}

const COPY: Record<string, { title: string; body: string; home: string; guides: string }> = {
  ko: { title: '없는 페이지다', body: '주소가 바뀌었거나 지워졌다.', home: '홈으로', guides: '가이드' },
  en: { title: 'This page does not exist', body: 'The address changed or the page was removed.', home: 'Home', guides: 'Guides' },
};

const notFoundCopy = (lang: string) => COPY[lang] ?? COPY[i18n.defaultLanguage];

export const meta = ({ location }: { location: { pathname: string } }) => [
  { title: notFoundCopy(localeFromPath(location.pathname)).title },
];

// Rendered from root.tsx's ErrorBoundary as well as the catch-all route, which has
// no `lang` param, so the locale comes from the path itself.
const NotFound = () => {
  const { pathname } = useLocation();
  const [path, setPath] = useState(pathname);

  // After hydration, put the visitor's own address back and speak its language.
  useEffect(() => {
    const original = window.__notFoundPath;
    if (!original) return;
    delete window.__notFoundPath;
    window.history.replaceState(window.history.state, '', original);
    setPath(new URL(original, window.location.origin).pathname);
  }, []);

  const lang = localeFromPath(path);
  const copy = notFoundCopy(lang);

  // root.tsx's <html lang> and meta title were rendered for the router's /404, so they
  // stay Korean after the address swap unless the page sets them to its own language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = copy.title;
  }, [lang, copy.title]);

  return (
    <HomeLayout {...baseOptions({ lang, localized: isLocalizedPath(path) })}>
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
