import { loadEnv } from 'vite';

/**
 * Fail when the site origin is missing or is not a bare origin.
 *
 * Every canonical, hreflang, sitemap and llms.txt URL is built from
 * `VITE_SITE_URL`. A default here would ship pages whose canonical points at
 * somebody else's host, so there is none.
 */
export const assertSiteUrl = (env: Record<string, string | undefined>): void => {
  const value = env.VITE_SITE_URL;

  if (!value) {
    throw new Error(
      'VITE_SITE_URL is not set. Add it to .env.<mode> (see .env.example).',
    );
  }

  if (!/^https?:\/\/[^/]+$/.test(value)) {
    throw new Error(
      `VITE_SITE_URL must be an origin with no trailing slash or path, got "${value}".`,
    );
  }
};

const STAGES = ['LOCAL', 'DEV', 'PROD'];

/**
 * Fail when `VITE_ENV` is not one of the known stages.
 *
 * Only the exact value `PROD` allows indexing (`app/lib/site.ts`). A typo such as
 * `prod` would publish the real site with `noindex` on every page and no error.
 */
export const assertStage = (env: Record<string, string | undefined>): void => {
  const value = env.VITE_ENV;

  if (!value || !STAGES.includes(value)) {
    throw new Error(
      `VITE_ENV must be one of ${STAGES.join(', ')}, got "${value ?? ''}".`,
    );
  }
};

/**
 * The check `vite.config.mts` runs, with its wiring.
 *
 * Reads through vite's `loadEnv`, the same lookup the build itself uses: `.env` and
 * `.env.<mode>` in `envDir`, with a `VITE_*` variable already in the process
 * environment taking precedence. The build runs as `react-router build --mode
 * <stage>`, so the stage file is normally where the value lives. Build only — `react-router typegen` and the dev server
 * load the same config and must not need a stage file.
 */
export const assertBuildEnv = ({
  command,
  envDir,
  mode,
}: {
  command: 'build' | 'serve';
  envDir: string;
  mode: string;
}): void => {
  if (command !== 'build') return;

  const env = loadEnv(mode, envDir, 'VITE_');

  assertSiteUrl(env);
  assertStage(env);
};
