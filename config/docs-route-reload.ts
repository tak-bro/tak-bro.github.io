import { utimesSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { Plugin } from 'vite';

export const isDocsPageFile = (file: string, docsDir: string): boolean =>
  file.startsWith(`${docsDir}${sep}`) && file.endsWith('.mdx');

/**
 * Reload the route config when a docs page is added or deleted in dev.
 *
 * app/routes.ts builds one route per page from a directory listing, and the
 * react-router dev server re-evaluates that config only when app/ or a module it
 * imports changes. A new page would otherwise 404 until the server restarts.
 * Touching routes.ts is the change the dev server already reacts to.
 */
export const docsRouteReload = ({ docsDir, routesFile }: { docsDir: string; routesFile: string }): Plugin => ({
  name: 'docs-route-reload',
  apply: 'serve',
  configureServer(server) {
    const dir = resolve(docsDir);
    const touchRoutes = (file: string) => {
      if (!isDocsPageFile(resolve(file), dir)) return;
      const now = new Date();
      utimesSync(routesFile, now, now);
    };

    server.watcher.add(dir);
    server.watcher.on('add', touchRoutes);
    server.watcher.on('unlink', touchRoutes);
  },
});
