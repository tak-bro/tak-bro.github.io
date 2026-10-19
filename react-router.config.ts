import type { Config } from '@react-router/dev/config';

export default {
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
  // Fully static output: no server runtime is deployed. Every route below is
  // emitted as HTML/JSON at build time and served from GitHub Pages.
  ssr: false,
  prerender: async ({ getStaticPaths }) => {
    // Every page has its own static route (routes.ts), so getStaticPaths lists
    // them all — including /api/search, the static search index. Dropping it
    // silently yields an empty search box.
    return getStaticPaths();
  },
} satisfies Config;
