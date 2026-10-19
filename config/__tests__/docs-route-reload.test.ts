import { describe, expect, it } from 'vitest';
import { isDocsPageFile } from '../docs-route-reload';

// Routes are generated from the docs files (app/routes.ts), so adding or
// deleting one must reload the route config; editing one must not.
describe('isDocsPageFile', () => {
  const dir = '/repo/content/docs';

  it('matches a page file anywhere under the docs directory', () => {
    expect(isDocsPageFile('/repo/content/docs/index.mdx', dir)).toBe(true);
    expect(isDocsPageFile('/repo/content/docs/herdr/keyboard.en.mdx', dir)).toBe(true);
  });

  it('ignores other files and other directories', () => {
    expect(isDocsPageFile('/repo/content/docs/meta.json', dir)).toBe(false);
    expect(isDocsPageFile('/repo/content/docs-old/index.mdx', dir)).toBe(false);
    expect(isDocsPageFile('/repo/app/routes.ts', dir)).toBe(false);
  });
});
