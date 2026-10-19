import { utimesSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { Plugin } from 'vite';

export const isContentPageFile = (file: string, contentDirs: readonly string[]): boolean =>
  file.endsWith('.mdx') && contentDirs.some((dir) => file.startsWith(`${dir}${sep}`));

/**
 * Reload the route config when a content page is added or deleted in dev.
 *
 * app/routes.ts builds one route per page from a directory listing, and the
 * react-router dev server re-evaluates that config only when app/ or a module it
 * imports changes. A new page would otherwise 404 until the server restarts.
 * Touching routes.ts is the change the dev server already reacts to.
 */
export const contentRouteReload = ({ contentDirs, routesFile }: { contentDirs: string[]; routesFile: string }): Plugin => ({
  name: 'content-route-reload',
  apply: 'serve',
  configureServer(server) {
    const dirs = contentDirs.map((dir) => resolve(dir));
    const touchRoutes = (file: string) => {
      if (!isContentPageFile(resolve(file), dirs)) return;
      const now = new Date();
      utimesSync(routesFile, now, now);
    };

    server.watcher.add(dirs);
    server.watcher.on('add', touchRoutes);
    server.watcher.on('unlink', touchRoutes);
  },
});
