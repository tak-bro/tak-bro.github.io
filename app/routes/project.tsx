import { use } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Link } from 'react-router';
import type { Route } from './+types/project';
import { VideoEmbed } from '../components';
import { baseOptions, pageTitle, projects, PROJECTS_ROUTE, projectsSource, requestPath } from '../lib';

// One route per project (routes.ts), so the name is the last path segment.
export const loader = ({ request }: Route.LoaderArgs) => {
  const name = decodeURIComponent(requestPath(request).slice(`${PROJECTS_ROUTE}/`.length).replace(/\/$/, ''));
  const page = projectsSource.getPage([name]);
  if (!page) throw new Response('Not found', { status: 404 });

  return { path: page.path };
};

const components = { ...defaultMdxComponents, VideoEmbed };

const Content = ({ path }: { path: string }) => {
  const page = projects.getPage(path);
  if (!page) throw new Error(`unknown project: ${path}`);
  // Content is loaded lazily; `use` suspends until the MDX chunk resolves.
  use(page.load());
  const Mdx = page.body;

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16">
      <title>{pageTitle(page.title)}</title>
      <meta name="description" content={page.description} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <Link to={PROJECTS_ROUTE} className="w-fit text-sm text-fd-muted-foreground hover:text-fd-foreground">
        ← 프로젝트
      </Link>
      <header className="flex flex-col gap-3 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
        <p className="text-fd-muted-foreground">{page.description}</p>
        <p className="text-sm text-fd-muted-foreground">
          <time dateTime={page.date}>{page.date}</time>
        </p>
        {page.links ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {page.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="underline underline-offset-4" rel="noreferrer" target="_blank">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <img src={page.screenshot} alt={`${page.title} 스크린샷`} className="mt-2 w-full rounded-lg border" />
      </header>
      <DocsBody>
        <Mdx components={components} />
      </DocsBody>
    </article>
  );
};

const Project = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions()}>
    <Content path={loaderData.path} />
  </HomeLayout>
);

export default Project;
