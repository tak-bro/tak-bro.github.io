import { fileURLToPath } from 'node:url';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig } from 'vitest/config';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // fumadocsMdx is required even in tests: app/lib/source.ts calls the
  // `defineDocs` macro, which only resolves under this plugin.
  plugins: [fumadocsMdx()],
  test: {
    globals: true,
    environment: 'node',
    // app/lib/site.ts reads these through import.meta.env; the build gets them from .env.<mode>.
    env: { VITE_ENV: 'LOCAL', VITE_SITE_URL: 'https://docs.example.test' },
    root: projectRoot,
    include: ['{app,config}/**/__tests__/**/*.test.ts'],
  },
});
