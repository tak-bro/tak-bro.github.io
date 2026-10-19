import defaultMdxComponents from 'fumadocs-ui/mdx';
import { resolveDocsHref } from '../lib';

// Typed off fumadocs' own component map rather than `mdx/types`: that specifier
// resolves to a .d.ts-only package, and vite's dev dependency optimizer tries to
// bundle it, which kills `react-router dev`.
type MDXComponentMap = typeof defaultMdxComponents;

/**
 * The MDX components for one docs page. Links are bound to the page they are
 * rendered in, since a relative href means nothing without it (resolveDocsHref).
 * `Card` renders its own link from `href` and never goes through `a`.
 */
export const docsMdxComponents = (slugs: string[], lang: string | undefined): MDXComponentMap => {
  const DefaultLink = defaultMdxComponents.a;
  const DefaultCard = defaultMdxComponents.Card;
  const resolve = (href: string | undefined) => (href ? resolveDocsHref(href, slugs, lang) : href);

  return {
    ...defaultMdxComponents,
    a: ({ href, ...props }) => <DefaultLink href={resolve(href)} {...props} />,
    Card: ({ href, ...props }) => <DefaultCard href={resolve(href)} {...props} />,
  };
};

/** A 16:9 video player for the iframes the old Jekyll project pages embedded. */
export const VideoEmbed = ({ src, title }: { src: string; title: string }) => (
  <iframe
    src={src}
    title={title}
    className="my-6 aspect-video w-full rounded-lg border"
    loading="lazy"
    allow="fullscreen; picture-in-picture"
  />
);
