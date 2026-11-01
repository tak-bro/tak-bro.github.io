/**
 * The path, query and hash of `address` when it resolves on `origin`, else null. A path like
 * `//host/x` resolves to another host, where `history.replaceState` throws.
 */
export const sameOriginPath = (address: string, origin: string): string | null => {
  const url = new URL(address, origin);
  return url.origin === origin ? url.pathname + url.search + url.hash : null;
};
