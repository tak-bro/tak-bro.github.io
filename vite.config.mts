import { realpathSync } from 'node:fs';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { contentRouteReload } from './config/content-route-reload.ts';
import { assertBuildEnv } from './config/env.ts';

export default defineConfig(({ command, mode }) => {
  assertBuildEnv({ command, envDir: import.meta.dirname, mode });

  return {
    plugins: [
      fumadocsMdx(),
      tailwindcss(),
      reactRouter(),
      contentRouteReload({
        contentDirs: [`${import.meta.dirname}/content/docs`],
        routesFile: `${import.meta.dirname}/app/routes.ts`,
      }),
    ],
    // A git worktree symlinks node_modules to the original checkout. Vite serves files by their real path, so
    // without this the dev server answers 403 for the client entry and the page never hydrates.
    server:
      command === 'serve'
        ? { fs: { allow: [searchForWorkspaceRoot(import.meta.dirname), realpathSync(`${import.meta.dirname}/node_modules`)] } }
        : undefined,
  };
});
