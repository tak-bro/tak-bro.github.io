import { describe, expect, it } from 'vitest';
import { parseGuideArgs } from '../../scripts/lib/guide-args.mjs';

describe('parseGuideArgs', () => {
  it('keeps every slug named, with or without --min', () => {
    expect(parseGuideArgs(['agent-config'])).toEqual({ slugs: ['agent-config'], min: 1 });
    expect(parseGuideArgs(['agent-config', '--min', '2'])).toEqual({ slugs: ['agent-config'], min: 2 });
    expect(parseGuideArgs(['--min', '2', 'herdr', 'keymaps'])).toEqual({ slugs: ['herdr', 'keymaps'], min: 2 });
  });

  it('checks every guide when none is named', () => {
    expect(parseGuideArgs([])).toEqual({ slugs: [], min: 1 });
  });

  // A floor of NaN would pass every page silently.
  it('refuses a --min that is not a whole number', () => {
    expect(() => parseGuideArgs(['--min', 'two'])).toThrow(/whole number/);
    expect(() => parseGuideArgs(['--min'])).toThrow(/whole number/);
  });
});
