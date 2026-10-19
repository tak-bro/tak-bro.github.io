import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight, BookOpen, Bot, FileText, GitPullRequest, Keyboard, Laptop, SquareTerminal, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import {
  baseOptions,
  GITHUB_URL,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
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

const GUIDE_ICONS: Record<string, LucideIcon> = {
  'agent-config': Bot,
  workflow: GitPullRequest,
  herdr: SquareTerminal,
  keymaps: Keyboard,
  setup: Laptop,
};

const REPO_URL = `${GITHUB_URL}/tak-bro.github.io`;

// Cards only for guides that exist; check:links fails on a card to an unwritten one.
export const loader = ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));

  return {
    lang,
    publishedGuides: homeCopy(lang)
      .guides.map((guide) => guide.slug)
      .filter((slug) => source.getPage([slug], lang) !== undefined),
  };
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const copy = homeCopy(loaderData.lang);
  const docsHref = localizedDocsHref(loaderData.lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));
  const groups = copy.guideGroups
    .map((group) => ({ ...group, guides: guides.filter((guide) => guide.group === group.id) }))
    .filter((group) => group.guides.length > 0);

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
            <h2 className="text-xl font-semibold">{copy.guidesHeading}</h2>
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
