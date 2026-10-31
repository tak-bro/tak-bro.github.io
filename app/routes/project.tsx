import { use } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ArrowUpRight } from 'lucide-react';
import type { Route } from './+types/project';
import { PageHeader, Session, VideoEmbed } from '../components';
import { baseOptions, CONTENT_ID, pageTitle, projects, PROJECTS_ROUTE, projectsSource, requestPath, screenshotWebp } from '../lib';

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
    <article id={CONTENT_ID} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-20">
      <title>{pageTitle(page.title)}</title>
      <meta name="description" content={page.description} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <PageHeader back={{ to: PROJECTS_ROUTE, label: '프로젝트' }} title={page.title} description={page.description}>
        <p className="text-sm text-fd-muted-foreground">
          <time dateTime={page.date} className="tabular-nums">
            {page.date}
          </time>
        </p>
        {page.links ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[15px]">
            {page.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="home-link font-medium" rel="noreferrer noopener" target="_blank">
                  <span>{link.title}</span>
                  <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
                  <span className="sr-only">(새 탭)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>
      {page.screenshot ? (
        <picture>
          <source srcSet={screenshotWebp(page.screenshot)} type="image/webp" />
          <img src={page.screenshot} alt={`${page.title} 스크린샷`} fetchPriority="high" className="w-full rounded-md bg-fd-card" />
        </picture>
      ) : page.sample ? (
        <figure className="rounded-md bg-fd-card p-4 sm:p-5 lg:p-7">
          <figcaption id="project-sample" className="sr-only">{`${page.title} 출력`}</figcaption>
          <Session lines={page.sample} labelledBy="project-sample" />
        </figure>
      ) : null}
      <DocsBody>
        <Mdx components={components} />
      </DocsBody>
    </article>
  );
};

const Project = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions({ localized: false })}>
    <Content path={loaderData.path} />
  </HomeLayout>
);

export default Project;
