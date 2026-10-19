import { source } from './source';

/**
 * Turn a relative link written in MDX into the URL that page is published at.
 *
 * fumadocs' default `a` hands the href straight to React Router, which resolves it
 * against the current path: `./encryption` on /docs/cli/sdk becomes
 * /docs/cli/sdk/encryption. So links name the content file they point at
 * (`./encryption.mdx`, the same string that resolves in an editor and on GitHub),
 * and `source.resolveHref` maps that file to the URL in the page's own language.
 * config/__tests__/content-links.test.ts holds the content to that form.
 */
export const resolveDocsHref = (href: string, slugs: string[], lang: string | undefined): string => {
  if (!href.startsWith('./') && !href.startsWith('../')) return href;

  const page = source.getPage(slugs, lang);
  if (!page) throw new Error(`cannot resolve "${href}": no page at /${slugs.join('/')} (${lang ?? 'default'})`);

  const resolved = source.resolveHref(href, page);
  // An untouched relative href is the silent fall-through this exists to stop:
  // failing here fails the prerender instead of shipping the broken link.
  if (resolved === href) {
    throw new Error(`unresolved relative link "${href}" in ${page.path}: no content file at that path`);
  }

  return resolved;
};
