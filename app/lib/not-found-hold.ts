import { createContext } from 'react';
import { sameOriginPath } from './same-origin-path';

/** Where 404.html holds the address a visitor asked for (scripts/write-404.mjs). */
export interface NotFoundHold {
  __notFoundPath?: string;
}

/** Takes the held address once. Null when there is none, or when it resolves to another host. */
export const takeNotFoundPath = (hold: NotFoundHold, origin: string): string | null => {
  const original = hold.__notFoundPath;
  if (!original) return null;
  delete hold.__notFoundPath;
  return sameOriginPath(original, origin);
};

/** A restored address, tied to the router location it was restored on. */
export interface HeldPath {
  key: string;
  path: string;
}

/**
 * The held path while the router is still on the location it was restored on, else null. The router
 * stays on /404 after the address is restored, so the document speaks for the held path until the
 * router moves to another location.
 */
export const heldPathAt = (locationKey: string, held: HeldPath | null): string | null =>
  held && held.key === locationKey ? held.path : null;

/** The restored path for the current location (or null), and how the 404 page restores one. */
export const NotFoundPathContext = createContext<{ heldPath: string | null; holdPath: (path: string) => void }>({
  heldPath: null,
  holdPath: () => undefined,
});
