import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';
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
  };
});
