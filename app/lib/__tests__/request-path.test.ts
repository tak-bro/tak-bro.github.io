import { describe, expect, it } from 'vitest';
import { requestPath } from '../request-path';

// A loader runs for the document request (/en) and for the data request the
// client and the prerenderer make (/en.data, /_.data for the root). Both must
// name the same page, or the data file carries the wrong language.
describe('requestPath', () => {
  const path = (url: string) => requestPath(new Request(`https://example.test${url}`));

  it('passes a document path through', () => {
    expect(path('/en/docs')).toBe('/en/docs');
    expect(path('/')).toBe('/');
  });

  it('strips the data-request suffix', () => {
    expect(path('/en.data')).toBe('/en');
    expect(path('/docs.data')).toBe('/docs');
    expect(path('/en/docs/herdr.data')).toBe('/en/docs/herdr');
  });

  it('maps the root data request to /', () => {
    expect(path('/_.data')).toBe('/');
    expect(path('/en/_.data')).toBe('/en/');
  });
});
