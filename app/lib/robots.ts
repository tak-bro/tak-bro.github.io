import { canonicalUrl } from './site';

/**
 * Crawlers named in their own group, by each vendor's robots.txt token: a crawler
 * obeys only the most specific group that matches it, so this rule survives a
 * Disallow added to `*` later.
 */
const NAMED_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Bingbot',
] as const;

/**
 * The robots.txt body for a stage.
 *
 * Non-prod still allows crawling on purpose: what keeps a local build out of an index
 * is the `noindex` in every page head (root.tsx), and a crawler that is disallowed
 * never reads it. Non-prod only leaves out the `Sitemap:` line.
 */
export const robotsTxt = (isProd: boolean): string =>
  [
    ...(isProd
      ? []
      : [
          '# Not the published site — see https://tak-bro.github.io.',
          '# Crawling is allowed so the noindex in every page head is read.',
        ]),
    'User-agent: *',
    'Allow: /',
    '',
    ...NAMED_CRAWLERS.map((crawler) => `User-agent: ${crawler}`),
    'Allow: /',
    '',
    ...(isProd ? [`Sitemap: ${canonicalUrl('/sitemap.xml')}`, ''] : []),
  ].join('\n');
