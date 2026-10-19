import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import type { Route } from './+types/projects';
import { baseOptions, pageTitle, projectPages } from '../lib';

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
  <HomeLayout {...baseOptions()}>
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{TITLE}</h1>
        <p className="text-fd-muted-foreground">{DESCRIPTION}</p>
      </header>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loaderData.projects.map((project) => (
          <li key={project.url}>
            <Link
              to={project.url}
              className="group flex h-full flex-col overflow-hidden rounded-lg border bg-fd-card transition-colors hover:bg-fd-accent"
            >
              <img src={project.screenshot} alt="" loading="lazy" className="aspect-video w-full border-b object-cover object-top" />
              <span className="flex flex-col gap-1 p-4">
                <span className="font-medium group-hover:underline">{project.title}</span>
                <span className="text-sm text-fd-muted-foreground">{project.description}</span>
                <time dateTime={project.date} className="text-xs text-fd-muted-foreground">
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
