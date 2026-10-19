import { sitemapEntries, sitemapXml } from '../lib';

// A resource route, like api/search: written to `sitemap.xml` at build time.
export const loader = async () =>
  new Response(sitemapXml(await sitemapEntries()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
