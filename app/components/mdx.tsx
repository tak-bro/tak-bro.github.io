import defaultMdxComponents from 'fumadocs-ui/mdx';
import { i18n, resolveDocsHref } from '../lib';
import { HerdrDemo } from './demo-video';
import { guideDiagrams } from './diagrams';

// Typed off fumadocs' own component map rather than `mdx/types`: that specifier
// resolves to a .d.ts-only package, and vite's dev dependency optimizer tries to
// bundle it, which kills `react-router dev`.
type MDXComponentMap = typeof defaultMdxComponents & { HerdrDemo: typeof HerdrDemo } & Record<keyof typeof guideDiagrams, () => React.JSX.Element>;

/** The diagrams take the page language, so MDX writes `<HarnessRepoDiagram />` with no props. */
const boundDiagrams = (lang: string | undefined) =>
  Object.fromEntries(
    Object.entries(guideDiagrams).map(([name, Figure]) => [name, () => <Figure lang={lang} />]),
  ) as Record<keyof typeof guideDiagrams, () => React.JSX.Element>;

const TABLE_LABEL: Record<string, string> = { ko: '표', en: 'Table' };

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
    table: (props) => (
      <div
        tabIndex={0}
        role="group"
        aria-label={TABLE_LABEL[lang ?? i18n.defaultLanguage] ?? TABLE_LABEL[i18n.defaultLanguage]}
        className="home-focus relative overflow-auto prose-no-margin my-6"
      >
        <table {...props} />
      </div>
    ),
  };
};
