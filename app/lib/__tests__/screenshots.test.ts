import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { screenshotThumb, screenshotWebp } from '../shared';
import { projectPages } from '../source';

describe('project screenshots', () => {
  it('has a WebP copy and a card thumbnail next to every screenshot', () => {
    const missing = projectPages()
      .flatMap((project) => [screenshotWebp(project.data.screenshot), screenshotThumb(project.data.screenshot)])
      .filter((src) => !existsSync(join('public', src)));

    expect(missing).toEqual([]);
  });
});
