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

  it('lists only guides whose docs folder exists', () => {
    // content/docs has no guide folders yet, so no card may link anywhere.
    expect(call('/').publishedGuides).toEqual([]);
    expect(call('/en').publishedGuides).toEqual([]);
  });
});

describe('home loader on a data request', () => {
  it('reads the language the same way as for the document', () => {
    expect(call('/en.data').lang).toBe('en');
    expect(call('/_.data').lang).toBe('ko');
  });
});
