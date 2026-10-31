import { use } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { Route } from './+types/blog-post';
import { PageHeader } from '../components';
import { baseOptions, blog, BLOG_ROUTE, blogSource, CONTENT_ID, pageTitle, requestPath } from '../lib';

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
  const { toc } = use(page.load());
  const Mdx = page.body;

  return (
    <div id={CONTENT_ID} className="mx-auto grid w-full max-w-6xl flex-1 gap-16 px-6 py-20 lg:grid-cols-[minmax(0,48rem)_14rem]">
      <article className="flex min-w-0 flex-col gap-12">
        <title>{pageTitle(page.title)}</title>
        <meta name="description" content={page.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="article:published_time" content={page.date} />
        <PageHeader back={{ to: BLOG_ROUTE, label: '블로그' }} title={page.title} description={page.description}>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-fd-muted-foreground">
            <time dateTime={page.date} className="tabular-nums">
              {page.date}
            </time>
            {page.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        </PageHeader>
        <DocsBody>
          <Mdx components={defaultMdxComponents} />
        </DocsBody>
      </article>
      {toc.length > 0 ? (
        <nav aria-label="목차" className="hidden lg:block">
          <ol className="sticky top-24 flex flex-col gap-1 text-[15px]">
            {toc.map((item) => (
              <li key={item.url} style={{ paddingLeft: `${Math.max(item.depth - 2, 0) * 0.75}rem` }}>
                <a
                  href={item.url}
                  className="block rounded-sm px-2 py-1 text-fd-muted-foreground break-keep transition-colors hover:bg-fd-card hover:text-fd-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
};

const BlogPost = ({ loaderData }: Route.ComponentProps) => (
  <HomeLayout {...baseOptions({ localized: false })}>
    <Content path={loaderData.path} />
  </HomeLayout>
);

export default BlogPost;
