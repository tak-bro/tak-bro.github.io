import { describe, expect, it } from 'vitest';
import { canonicalUrl } from '../site';

describe('canonicalUrl', () => {
  // GitHub Pages redirects /docs/herdr to /docs/herdr/; the canonical must be the address that answers 200.
  it('ends a page URL in a slash', () => {
    expect(canonicalUrl('/')).toBe('https://docs.example.test/');
    expect(canonicalUrl('/en')).toBe('https://docs.example.test/en/');
    expect(canonicalUrl('/docs/herdr')).toBe('https://docs.example.test/docs/herdr/');
    expect(canonicalUrl('/en/docs/')).toBe('https://docs.example.test/en/docs/');
    expect(canonicalUrl('/docs/herdr#ghostty')).toBe('https://docs.example.test/docs/herdr/#ghostty');
  });

  it('leaves a file URL as it is', () => {
    expect(canonicalUrl('/og.png')).toBe('https://docs.example.test/og.png');
    expect(canonicalUrl('/sitemap.xml')).toBe('https://docs.example.test/sitemap.xml');
  });
});
