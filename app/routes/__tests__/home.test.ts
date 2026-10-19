import { describe, expect, it } from 'vitest';
import { loader } from '../home';

type LoaderArgs = Parameters<typeof loader>[0];

const call = (pathname: string) =>
  loader({ request: new Request(`https://example.test${pathname}`) } as LoaderArgs);

describe('home loader', () => {
  it('takes the language from the path', () => {
    expect(call('/').lang).toBe('ko');
    expect(call('/en').lang).toBe('en');
  });

  it('lists only guides whose docs page exists', () => {
    // Only the Herdr, keymaps and setup guides are written so far; other cards would link to a 404.
    expect(call('/').publishedGuides).toEqual(['herdr', 'keymaps', 'setup']);
    expect(call('/en').publishedGuides).toEqual(['herdr', 'keymaps', 'setup']);
  });
});

describe('home loader on a data request', () => {
  it('reads the language the same way as for the document', () => {
    expect(call('/en.data').lang).toBe('en');
    expect(call('/_.data').lang).toBe('ko');
  });
});
