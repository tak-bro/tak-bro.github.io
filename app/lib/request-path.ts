/**
 * The page a loader request is for. Besides the document request (/en), the
 * client and the prerenderer fetch loader data at the page path plus `.data`
 * (/en.data), and at `_.data` for a path ending in `/`. Routes read their
 * language and slugs from the path, so the suffix has to go first.
 */
export const requestPath = (request: Request): string => {
  const { pathname } = new URL(request.url);

  if (pathname.endsWith('/_.data')) return pathname.slice(0, -'_.data'.length);
  if (pathname.endsWith('.data')) return pathname.slice(0, -'.data'.length);

  return pathname;
};
