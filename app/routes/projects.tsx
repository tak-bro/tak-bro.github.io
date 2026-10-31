import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import type { Route } from './+types/projects';
import { PageHeader } from '../components';
import { baseOptions, CONTENT_ID, pageTitle, projectPages, screenshotThumb } from '../lib';

const TITLE = '프로젝트';
const DESCRIPTION = '학생 때와 사이드로 만든 것들.';

export const meta = () => [
  { title: pageTitle(TITLE) },
  { name: 'description', content: DESCRIPTION },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: TITLE },
  { property: 'og:description', content: DESCRIPTION },
];

export const loader = () => ({
  projects: projectPages().map((project) => ({
    url: project.url,
    title: project.data.title,
    description: project.data.description,
    date: project.data.date,
    screenshot: project.data.screenshot,
  })),
});

const Projects = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions({ localized: false })}>
    <div id={CONTENT_ID} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-20">
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loaderData.projects.map((project) => (
          <li key={project.url}>
            <Link
              to={project.url}
              className="flex h-full flex-col overflow-hidden rounded-md bg-fd-card transition-colors hover:bg-fd-accent"
            >
              <img
                src={screenshotThumb(project.screenshot)}
                alt=""
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full object-cover object-top"
              />
              <span className="flex flex-col gap-1 p-5">
                <span className="text-[17px] font-semibold">{project.title}</span>
                <span className="text-[15px] text-fd-muted-foreground break-keep">{project.description}</span>
                <time dateTime={project.date} className="text-sm tabular-nums text-fd-muted-foreground">
                  {project.date}
                </time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </HomeLayout>
);

export default Projects;
