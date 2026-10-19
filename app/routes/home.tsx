import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { baseOptions, BLOG_ROUTE, blogPosts, homeCopy, localeFromPath, localizedDocsHref, requestPath, source } from '../lib';

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

// Cards only for guides that exist; check:links fails on a card to an unwritten one.
export const loader = ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));

  return {
    lang,
    publishedGuides: homeCopy(lang)
      .guides.map((guide) => guide.slug)
      .filter((slug) => source.getPage([slug], lang) !== undefined),
    // Korean only, so the English home links the same Korean posts.
    recentPosts: blogPosts()
      .slice(0, RECENT_POSTS)
      .map((post) => ({ url: post.url, title: post.data.title, date: post.data.date })),
  };
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const copy = homeCopy(loaderData.lang);
  const docsHref = localizedDocsHref(loaderData.lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));

  return (
    <HomeLayout {...baseOptions({ lang: loaderData.lang })}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.heading}</h1>
          <p className="max-w-2xl text-fd-muted-foreground">{copy.intro}</p>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground"
            to={docsHref}
          >
            {copy.docsCta}
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </section>
        {guides.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{copy.guidesHeading}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    className="flex h-full flex-col gap-1 rounded-lg border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
                    to={`${docsHref}/${guide.slug}`}
                  >
                    <span className="font-medium">{guide.title}</span>
                    <span className="text-sm text-fd-muted-foreground">{guide.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{copy.recentPostsHeading}</h2>
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
          <Link to={BLOG_ROUTE} className="inline-flex w-fit items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            {copy.allPostsLabel}
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </section>
      </div>
    </HomeLayout>
  );
};

export default Home;
