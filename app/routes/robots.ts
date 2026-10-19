import { IS_PROD, robotsTxt } from '../lib';

// A route rather than a file in public/: the Sitemap line is an absolute URL built
// from VITE_SITE_URL, and the body differs by stage.
export const loader = () =>
  new Response(robotsTxt(IS_PROD), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
