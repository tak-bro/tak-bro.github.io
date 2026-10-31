import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/blog';
import { PageHeader, primaryButton } from '../components';
import { baseOptions, blogPosts, CONTENT_ID, DOCS_ROUTE, filterByTag, groupByYear, listedPosts, pageTitle, tagCounts } from '../lib';

const TITLE = '블로그';
const DESCRIPTION = '코딩 에이전트를 쓰며 남기는 사고와 규칙 기록.';

export const meta = () => [
  { title: pageTitle(TITLE) },
  { name: 'description', content: DESCRIPTION },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: TITLE },
  { property: 'og:description', content: DESCRIPTION },
];

export const loader = () => ({
  posts: listedPosts(
    blogPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      tags: post.data.tags,
    })),
  ),
});

const chipClass =
  'min-h-8 rounded-sm bg-fd-card px-3 py-1 text-sm transition-colors hover:bg-fd-accent aria-pressed:bg-fd-foreground aria-pressed:text-fd-background';

const Blog = ({ loaderData }: Route.ComponentProps) => {
  // Client-side only: the prerendered page lists every post, and a URL-driven
  // filter would hydrate against HTML that does not match it.
  const [tag, setTag] = useState<string | null>(null);
  const tags = tagCounts(loaderData.posts);
  const years = groupByYear(filterByTag(loaderData.posts, tag));

  return (
    <HomeLayout {...baseOptions({ localized: false })}>
      <div id={CONTENT_ID} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-20">
        <PageHeader title={TITLE} description={DESCRIPTION} />
        {loaderData.posts.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-md bg-fd-card p-6">
            <p className="text-[17px] break-keep">아직 글이 없다. 지금까지의 기록은 원칙 가이드에 모았다.</p>
            <Link
              to={`${DOCS_ROUTE}/principles`}
              className={primaryButton}
            >
              원칙 읽기
            </Link>
          </div>
        ) : (
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
        )}
        <div className="flex flex-col gap-6">
          {years.map(({ year, posts }) => (
            <section key={year} aria-labelledby={`year-${year}`} className="grid gap-2 md:grid-cols-[5rem_1fr] md:gap-6">
              <h2
                id={`year-${year}`}
                className="text-[15px] font-semibold tabular-nums text-fd-muted-foreground md:sticky md:top-20 md:self-start md:pt-4"
              >
                {year}
              </h2>
              <ul className="flex flex-col gap-1">
                {posts.map((post) => (
                  <li key={post.url}>
                    <Link to={post.url} className="-mx-3 flex flex-col gap-1 rounded-md px-3 py-4 transition-colors hover:bg-fd-card">
                      <span className="text-[17px] font-semibold">{post.title}</span>
                      <span className="text-[15px] text-fd-muted-foreground break-keep">{post.description}</span>
                      <span className="flex gap-2 text-sm text-fd-muted-foreground">
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
