import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import type { Route } from './+types/blog';
import { baseOptions, blogPosts, pageTitle } from '../lib';

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

const Blog = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions()}>
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{TITLE}</h1>
        <p className="text-fd-muted-foreground">{DESCRIPTION}</p>
      </header>
      <ul className="flex flex-col divide-y">
        {loaderData.posts.map((post) => (
          <li key={post.url} className="py-4">
            <Link to={post.url} className="group flex flex-col gap-1">
              <span className="font-medium group-hover:underline">{post.title}</span>
              <span className="text-sm text-fd-muted-foreground">{post.description}</span>
              <span className="flex gap-2 text-xs text-fd-muted-foreground">
                <time dateTime={post.date}>{post.date}</time>
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </HomeLayout>
);

export default Blog;
