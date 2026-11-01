import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { isValidElement, type ReactNode } from 'react';
import { localized, resolveDocsHref } from '../lib';
import { HerdrDemo } from './demo-video';
import { guideDiagrams } from './diagrams';

// Typed off fumadocs' own component map rather than `mdx/types`: that specifier
// resolves to a .d.ts-only package, and vite's dev dependency optimizer tries to
// bundle it, which kills `react-router dev`.
type BoundDiagrams = Record<keyof typeof guideDiagrams, () => React.JSX.Element>;
type MDXComponentMap = typeof defaultMdxComponents & { HerdrDemo: typeof HerdrDemo } & BoundDiagrams;

/** The diagrams take the page language, so MDX writes `<HarnessRepoDiagram />` with no props. */
const boundDiagrams = (lang: string | undefined) =>
  Object.fromEntries(
    Object.entries(guideDiagrams).map(([name, Figure]) => [name, () => <Figure lang={lang} />]),
  ) as BoundDiagrams;

const TABLE_LABEL: Record<string, string> = { ko: '표', en: 'Table' };
const CODE_LABEL: Record<string, string> = { ko: '코드', en: 'Code' };

/** The plain text of rendered MDX (shiki's line spans included). */
const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
};

/** A code block's scroll area is a region; its title, or else its first line, tells one block from the next. */
const codeName = (title: string | undefined, children: ReactNode) => {
  const first = textOf(children).split('\n').find((line) => line.trim()) ?? '';
  const name = (title ?? first).replace(/\s+/g, ' ').trim();
  return name.length > 48 ? `${name.slice(0, 47)}…` : name;
};

/**
 * The MDX components for one docs page. Links are bound to the page they are
 * rendered in, since a relative href means nothing without it (resolveDocsHref).
 * `Card` renders its own link from `href` and never goes through `a`.
 * A wide table scrolls inside its wrapper, so the wrapper takes focus to be scrolled by keyboard.
 * It is a named group, not a region: tables have no captions, and several regions with one name
 * would be indistinct landmarks.
 */
export const docsMdxComponents = (slugs: string[], lang: string | undefined): MDXComponentMap => {
  const DefaultLink = defaultMdxComponents.a;
  const DefaultCard = defaultMdxComponents.Card;
  const resolve = (href: string | undefined) => (href ? resolveDocsHref(href, slugs, lang) : href);

  return {
    ...defaultMdxComponents,
    ...boundDiagrams(lang),
    HerdrDemo,
    a: ({ href, ...props }) => <DefaultLink href={resolve(href)} {...props} />,
    Card: ({ href, ...props }) => <DefaultCard href={resolve(href)} {...props} />,
    pre: ({ title, children, ...props }) => (
      <CodeBlock title={title} {...props} viewportProps={{ 'aria-label': `${localized(CODE_LABEL, lang)}: ${codeName(title, children)}` }}>
        <Pre>{children}</Pre>
      </CodeBlock>
    ),
    table: (props) => (
      <div
        tabIndex={0}
        role="group"
        aria-label={localized(TABLE_LABEL, lang)}
        className="home-focus relative overflow-auto prose-no-margin my-6"
      >
        <table {...props} />
      </div>
    ),
  };
};
