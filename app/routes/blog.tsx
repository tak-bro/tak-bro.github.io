import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/blog';
import { baseOptions, blogPosts, filterByTag, groupByYear, pageTitle, tagCounts } from '../lib';

const TITLE = '블로그';
const DESCRIPTION = '2015년부터 쓴 개발 글.';

export const meta = () => [
  { title: pageTitle(TITLE) },
  { name: 'description', content: DESCRIPTION },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: TITLE },
  { property: 'og:description', content: DESCRIPTION },
];

export const loader = () => ({
  posts: blogPosts().map((post) => ({
    url: post.url,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date,
    tags: post.data.tags,
  })),
});

const chipClass =
  'rounded-full border px-3 py-1 text-xs transition-colors aria-pressed:border-fd-primary aria-pressed:bg-fd-primary aria-pressed:text-fd-primary-foreground hover:bg-fd-accent aria-pressed:hover:bg-fd-primary';

const Blog = ({ loaderData }: Route.ComponentProps) => {
  // Client-side only: the prerendered page lists every post, and a URL-driven
  // filter would hydrate against HTML that does not match it.
  const [tag, setTag] = useState<string | null>(null);
  const tags = tagCounts(loaderData.posts);
  const years = groupByYear(filterByTag(loaderData.posts, tag));

  return (
    <HomeLayout {...baseOptions({ localized: false })}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{TITLE}</h1>
          <p className="text-fd-muted-foreground">{DESCRIPTION}</p>
        </header>
        <div role="group" aria-label="태그로 거르기" className="flex flex-wrap gap-2">
          <button type="button" className={chipClass} aria-pressed={tag === null} onClick={() => setTag(null)}>
            전체 <span className="tabular-nums opacity-70">{loaderData.posts.length}</span>
          </button>
          {tags.map(({ tag: name, count }) => (
            <button
              key={name}
              type="button"
              className={chipClass}
              aria-pressed={tag === name}
              onClick={() => setTag(tag === name ? null : name)}
            >
              #{name} <span className="tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {years.map(({ year, posts }) => (
            <section key={year} aria-labelledby={`year-${year}`} className="grid gap-2 md:grid-cols-[5rem_1fr] md:gap-6">
              <h2
                id={`year-${year}`}
                className="text-sm font-semibold tabular-nums text-fd-muted-foreground md:sticky md:top-20 md:self-start md:pt-4"
              >
                {year}
              </h2>
              <ul className="flex flex-col divide-y">
                {posts.map((post) => (
                  <li key={post.url} className="py-4">
                    <Link to={post.url} className="group flex flex-col gap-1">
                      <span className="font-medium group-hover:underline">{post.title}</span>
                      <span className="text-sm text-fd-muted-foreground">{post.description}</span>
                      <span className="flex gap-2 text-xs text-fd-muted-foreground">
                        <time dateTime={post.date} className="tabular-nums">
                          {post.date}
                        </time>
                        {post.tags.map((name) => (
                          <span key={name}>#{name}</span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Blog;
