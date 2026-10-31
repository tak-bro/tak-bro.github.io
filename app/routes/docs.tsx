import { use, useMemo } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import type { Route } from './+types/docs';
import { baseOptions, docs, DOCS_ROUTE, i18n, localeFromPath, localeSwitchPath, pageTitle, requestPath, source } from '../lib';
import { docsMdxComponents } from '../components';
// Not through the barrel: the home imports it too, and this pulls fumadocs' TOC into its first load.
import { docsTocSlots } from '../components/toc';

// One module behind a route per page and language (routes.ts), so the language
// and the slugs both come from the path.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const pathname = requestPath(request);
  const lang = localeFromPath(pathname);
  const slugs = localeSwitchPath(pathname, lang, i18n.defaultLanguage)
    .slice(DOCS_ROUTE.length)
    .split('/')
    .filter((segment) => segment.length > 0)
    // The request path is percent-encoded; slugs are the raw file names.
    .map((segment) => decodeURIComponent(segment));
  const page = source.getPage(slugs, lang);
  if (!page) throw new Response('Not found', { status: 404 });

  return {
    path: page.path,
    slugs,
    lang,
    pageTree: await source.serializePageTree(source.getPageTree(lang)),
  };
};

const Content = ({ path, slugs, lang }: { path: string; slugs: string[]; lang: string }) => {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  // Content is loaded lazily; `use` suspends until the MDX chunk resolves.
  const { toc } = use(page.load());
  const Mdx = page.body;
  // Stable across re-renders: a new component type would remount every link.
  const components = useMemo(() => docsMdxComponents(slugs, lang), [slugs, lang]);

  return (
    <DocsPage toc={toc} slots={{ toc: docsTocSlots }}>
      <title>{pageTitle(page.title)}</title>
      <meta name="description" content={page.description} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <Mdx components={components} />
      </DocsBody>
    </DocsPage>
  );
};

const DocsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { pageTree, path, slugs, lang } = useFumadocsLoader(loaderData);

  return (
    <DocsLayout {...baseOptions({ lang })} tree={pageTree}>
      <Content path={path} slugs={slugs} lang={lang} />
    </DocsLayout>
  );
};

export default DocsRoute;
