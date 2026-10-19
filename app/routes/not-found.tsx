import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link, useLocation } from 'react-router';
import { baseOptions, i18n, isLocalizedPath, localeFromPath, localizedDocsHref } from '../lib';

const COPY: Record<string, { title: string; body: string; back: string }> = {
  ko: { title: '페이지를 찾을 수 없습니다', body: '주소가 바뀌었거나 없는 페이지입니다.', back: '문서로 돌아가기' },
  en: { title: 'Not Found', body: 'This page could not be found.', back: 'Back to Docs' },
};

const notFoundCopy = (lang: string) => COPY[lang] ?? COPY[i18n.defaultLanguage];

export const meta = ({ location }: { location: { pathname: string } }) => [
  { title: notFoundCopy(localeFromPath(location.pathname)).title },
];

// Rendered from root.tsx's ErrorBoundary as well as the catch-all route, which has
// no `lang` param, so the locale comes from the path itself.
const NotFound = () => {
  const { pathname } = useLocation();
  const lang = localeFromPath(pathname);
  const copy = notFoundCopy(lang);

  return (
    <HomeLayout {...baseOptions({ lang, localized: isLocalizedPath(pathname) })}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">{copy.title}</h1>
        <p className="text-fd-muted-foreground mb-4">{copy.body}</p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={localizedDocsHref(lang)}
        >
          {copy.back}
        </Link>
      </div>
    </HomeLayout>
  );
};

export default NotFound;
