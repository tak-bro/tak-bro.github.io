import { describe, expect, it } from 'vitest';
import { heldPathAt, takeNotFoundPath } from '../not-found-hold';

const ORIGIN = 'https://tak-bro.github.io';

describe('takeNotFoundPath', () => {
  it('takes the held address once, with its query and hash', () => {
    const hold: { __notFoundPath?: string } = { __notFoundPath: '/en/nope-x?q=1#top' };
    expect(takeNotFoundPath(hold, ORIGIN)).toBe('/en/nope-x?q=1#top');
    expect(takeNotFoundPath(hold, ORIGIN)).toBeNull();
  });

  it('drops an address on another host', () => {
    expect(takeNotFoundPath({ __notFoundPath: '//example.com/x' }, ORIGIN)).toBeNull();
  });
});

// The root renders <html lang>, the skip link and the locale switch from this path, else the router's.
describe('heldPathAt', () => {
  const held = { key: 'k404', path: '/en/nope-x' };

  it('speaks for the restored address while the router is still on /404', () => {
    expect(heldPathAt('k404', held)).toBe('/en/nope-x');
  });

  it('lets go once the router moves on, so a Korean page is not left in English', () => {
    expect(heldPathAt('kBlog', held)).toBeNull();
    expect(heldPathAt('k404', null)).toBeNull();
  });
});
