import { fileURLToPath } from 'node:url';

// SITE_BUILD_DIR lets each script's test point it at a fixture tree.
export const BUILD_DIR =
  process.env.SITE_BUILD_DIR ?? fileURLToPath(new URL('../../build/client', import.meta.url));
