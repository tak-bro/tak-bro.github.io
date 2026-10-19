import { describe, expect, it } from 'vitest';
import { isContentPageFile } from '../content-route-reload';

// Routes are generated from the content files (app/routes.ts), so adding or
// deleting one must reload the route config; editing one must not.
describe('isContentPageFile', () => {
  const dirs = ['/repo/content/docs', '/repo/content/blog'];

  it('matches a page file anywhere under any content directory', () => {
    expect(isContentPageFile('/repo/content/docs/index.mdx', dirs)).toBe(true);
    expect(isContentPageFile('/repo/content/docs/herdr/keyboard.en.mdx', dirs)).toBe(true);
    expect(isContentPageFile('/repo/content/blog/eos-tutorial.mdx', dirs)).toBe(true);
  });

  it('ignores other files and other directories', () => {
    expect(isContentPageFile('/repo/content/docs/meta.json', dirs)).toBe(false);
    expect(isContentPageFile('/repo/content/docs-old/index.mdx', dirs)).toBe(false);
    expect(isContentPageFile('/repo/content/snippets/x.mdx', dirs)).toBe(false);
    expect(isContentPageFile('/repo/app/routes.ts', dirs)).toBe(false);
  });
});
