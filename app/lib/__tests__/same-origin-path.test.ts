import { describe, expect, it } from 'vitest';
import { sameOriginPath } from '../same-origin-path';

const ORIGIN = 'https://tak-bro.github.io';

describe('sameOriginPath', () => {
  it('keeps the path, query and hash of an address on the site', () => {
    expect(sameOriginPath('/en/missing?q=1#top', ORIGIN)).toBe('/en/missing?q=1#top');
  });

  it('refuses an address that resolves to another host', () => {
    expect(sameOriginPath('//example.com/x', ORIGIN)).toBeNull();
  });
});
