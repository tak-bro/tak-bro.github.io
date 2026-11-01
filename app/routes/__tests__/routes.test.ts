import { matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';
import routeConfig from '../../routes';

const routes = await routeConfig;

/**
 * The build is static (`ssr: false`), so a URL that was not prerendered has no
 * loader data. A route with a loader that matches such a URL renders a data
 * error instead of the 404. Only real pages may match, then, and anything else
 * must fall through to the catch-all.
 */
const routeIdFor = (pathname: string): string | undefined =>
  matchRoutes(routes as Parameters<typeof matchRoutes>[0], pathname)?.at(-1)?.route.id;

describe('routes', () => {
  it('serves each language home from its own route', () => {
    expect(routeIdFor('/')).toBe('home-ko');
    expect(routeIdFor('/en')).toBe('home-en');
  });

  it('gives every docs page in content/docs its own route in each language', () => {
    expect(routeIdFor('/docs')).toBe('docs:/docs');
    expect(routeIdFor('/en/docs')).toBe('docs:/en/docs');
  });

  it('sends a docs path with no content file to the 404', () => {
    // A `docs/*` splat would hand /docs/nope to the docs loader, which has no
    // data for it in a static build and renders a data error.
    expect(routeIdFor('/docs/nope')).toBe('not-found');
    expect(routeIdFor('/en/docs/nope')).toBe('not-found');
  });

  it('sends unknown first segments to the 404, not to a page with a loader', () => {
    expect(routeIdFor('/nope-x')).toBe('not-found');
    expect(routeIdFor('/ko')).toBe('not-found');
    expect(routeIdFor('/nope/docs/x')).toBe('not-found');
  });

  // The posts and projects were removed; their old addresses must reach the 404, not an empty page.
  it('sends the old blog and project addresses to the 404', () => {
    for (const path of ['/blog', '/blog/advanced-java01', '/projects', '/projects/hwip']) {
      expect(routeIdFor(path), path).toBe('not-found');
    }
  });
});
