import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight, BookOpen, Bot, FileText, GitPullRequest, Keyboard, Laptop, SquareTerminal, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import {
  baseOptions,
  BLOG_ROUTE,
  blogPosts,
  GITHUB_URL,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
  projectPages,
  PROJECTS_ROUTE,
  requestPath,
  source,
} from '../lib';

export const meta = ({ location }: Route.MetaArgs) => {
  const copy = homeCopy(localeFromPath(location.pathname));

  return [
    { title: copy.title },
    { name: 'description', content: copy.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: copy.title },
    { property: 'og:description', content: copy.description },
  ];
};

const RECENT_POSTS = 5;
const RECENT_PROJECTS = 3;

const GUIDE_ICONS: Record<string, LucideIcon> = {
  'agent-config': Bot,
  workflow: GitPullRequest,
  herdr: SquareTerminal,
  keymaps: Keyboard,
  setup: Laptop,
};

const REPO_URL = `${GITHUB_URL}/tak-bro.github.io`;

const year = (date: string) => date.slice(0, 4);

// Cards only for guides that exist; check:links fails on a card to an unwritten one.
export const loader = ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));
  const posts = blogPosts();

  return {
    lang,
    publishedGuides: homeCopy(lang)
      .guides.map((guide) => guide.slug)
      .filter((slug) => source.getPage([slug], lang) !== undefined),
    // Korean only, so the English home links the same Korean posts and projects.
    recentPosts: posts
      .slice(0, RECENT_POSTS)
      .map((post) => ({ url: post.url, title: post.data.title, date: post.data.date })),
    // The blog stopped years ago; the heading shows the span instead of "recent".
    postYears: { first: year(posts.at(-1)?.data.date ?? ''), last: year(posts[0]?.data.date ?? '') },
    recentProjects: projectPages()
      .slice(0, RECENT_PROJECTS)
      .map((project) => ({
        url: project.url,
        title: project.data.title,
        description: project.data.description,
        date: project.data.date,
        screenshot: project.data.screenshot,
      })),
  };
};

const SectionHeading = ({ title, aside }: { title: string; aside?: string }) => (
  <h2 className="flex items-baseline gap-3 text-xl font-semibold">
    {title}
    {aside ? <span className="text-sm font-normal text-fd-muted-foreground">{aside}</span> : null}
  </h2>
);

const MoreLink = ({ to, label }: { to: string; label: string }) => (
  <Link to={to} className="inline-flex w-fit items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
    {label}
    <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
  </Link>
);

const Home = ({ loaderData }: Route.ComponentProps) => {
  const copy = homeCopy(loaderData.lang);
  const docsHref = localizedDocsHref(loaderData.lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));
  const groups = copy.guideGroups
    .map((group) => ({ ...group, guides: guides.filter((guide) => guide.group === group.id) }))
    .filter((group) => group.guides.length > 0);
  const { first, last } = loaderData.postYears;

  return (
    <HomeLayout {...baseOptions({ lang: loaderData.lang })}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-16">
        <section className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold tracking-tight break-keep sm:text-4xl">{copy.heading}</h1>
          <p className="max-w-2xl text-fd-muted-foreground break-keep">{copy.intro}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground"
              to={docsHref}
            >
              {copy.docsCta}
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
              href={GITHUB_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              GitHub
              <span className="sr-only">{copy.newTabLabel}</span>
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
              href={copy.resumeHref}
            >
              {copy.resumeLabel}
              <FileText className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
          </div>
        </section>
        {groups.length > 0 ? (
          <section className="flex flex-col gap-6">
            <SectionHeading title={copy.guidesHeading} />
            {groups.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-fd-muted-foreground">{group.heading}</h3>
                <ul className={`grid gap-4 sm:grid-cols-2 ${group.guides.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                  {group.guides.map((guide) => {
                    const Icon = GUIDE_ICONS[guide.slug] ?? BookOpen;

                    return (
                      <li key={guide.slug}>
                        <Link
                          className="group flex h-full gap-3 rounded-lg border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
                          to={`${docsHref}/${guide.slug}`}
                        >
                          <Icon className="mt-0.5 size-5 shrink-0 text-fd-muted-foreground" strokeWidth={1.5} aria-hidden />
                          <span className="flex flex-col gap-1">
                            <span className="font-medium group-hover:underline">{guide.title}</span>
                            <span className="text-sm text-fd-muted-foreground break-keep">{guide.blurb}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        ) : null}
        {loaderData.recentProjects.length > 0 ? (
        <section className="flex flex-col gap-4">
          <SectionHeading title={copy.projectsHeading} />
          <ul className="grid gap-4 sm:grid-cols-3">
            {loaderData.recentProjects.map((project) => (
              <li key={project.url}>
                <Link
                  to={project.url}
                  className="group flex h-full overflow-hidden rounded-lg border bg-fd-card transition-colors hover:bg-fd-accent sm:flex-col"
                >
                  <img
                    src={project.screenshot}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-28 shrink-0 border-r object-cover object-top sm:w-full sm:border-r-0 sm:border-b"
                  />
                  <span lang="ko" className="flex flex-col gap-1 p-3 sm:p-4">
                    <span className="font-medium group-hover:underline">{project.title}</span>
                    <span className="line-clamp-2 text-sm text-fd-muted-foreground break-keep">{project.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink to={PROJECTS_ROUTE} label={copy.allProjectsLabel} />
        </section>
        ) : null}
        <section className="flex flex-col gap-4">
          <SectionHeading title={copy.blogHeading} aside={first && last ? `${first}–${last}` : undefined} />
          <ul className="flex flex-col divide-y">
            {loaderData.recentPosts.map((post) => (
              <li key={post.url}>
                <Link to={post.url} className="group flex items-baseline justify-between gap-4 py-3">
                  <span lang="ko" className="font-medium break-keep group-hover:underline">
                    {post.title}
                  </span>
                  <time dateTime={post.date} className="shrink-0 text-sm text-fd-muted-foreground">
                    {post.date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink to={BLOG_ROUTE} label={copy.allPostsLabel} />
        </section>
      </div>
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-fd-muted-foreground">
          <span>© 2026 tak-bro</span>
          <span className="flex gap-3">
            <a href={`${REPO_URL}/blob/main/LICENSE`} className="underline-offset-4 hover:underline">
              {copy.codeLicense}
            </a>
            <a href={`${REPO_URL}/blob/main/LICENSE-CONTENT`} className="underline-offset-4 hover:underline">
              {copy.contentLicense}
            </a>
          </span>
        </div>
      </footer>
    </HomeLayout>
  );
};

export default Home;
