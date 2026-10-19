import { use } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Link } from 'react-router';
import type { Route } from './+types/blog-post';
import { baseOptions, blog, BLOG_ROUTE, blogSource, pageTitle, requestPath } from '../lib';

// One route per post (routes.ts), so the slug is the last path segment.
export const loader = ({ request }: Route.LoaderArgs) => {
  const slug = decodeURIComponent(requestPath(request).slice(`${BLOG_ROUTE}/`.length).replace(/\/$/, ''));
  const page = blogSource.getPage([slug]);
  if (!page) throw new Response('Not found', { status: 404 });

  return { path: page.path };
};

const Content = ({ path }: { path: string }) => {
  const page = blog.getPage(path);
  if (!page) throw new Error(`unknown post: ${path}`);
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
      <meta property="article:published_time" content={page.date} />
      <Link to={BLOG_ROUTE} className="w-fit text-sm text-fd-muted-foreground hover:text-fd-foreground">
        ← 블로그
      </Link>
      <header className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
        <p className="text-fd-muted-foreground">{page.description}</p>
        <p className="flex gap-2 text-sm text-fd-muted-foreground">
          <time dateTime={page.date}>{page.date}</time>
          {page.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      </header>
      <DocsBody>
        <Mdx components={defaultMdxComponents} />
      </DocsBody>
    </article>
  );
};

const BlogPost = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions({ localized: false })}>
    <Content path={loaderData.path} />
  </HomeLayout>
);

export default BlogPost;
