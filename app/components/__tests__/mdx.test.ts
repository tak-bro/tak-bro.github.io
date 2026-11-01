import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { docsMdxComponents } from '../mdx';

const tableWrapper = (lang: string) => {
  const Table = docsMdxComponents([], lang).table;
  return renderToStaticMarkup(createElement(Table, null, createElement('tbody'))).match(/^<div[^>]*>/)?.[0] ?? '';
};

// A wide table scrolls inside its wrapper; a keyboard can only scroll what it can focus.
describe('docsMdxComponents table', () => {
  it('wraps the table in a focusable, named group in the page language', () => {
    expect(tableWrapper('ko')).toMatch(/tabindex="0"/);
    expect(tableWrapper('ko')).toMatch(/role="group"/);
    expect(tableWrapper('ko')).toMatch(/aria-label="표"/);
    expect(tableWrapper('en')).toMatch(/aria-label="Table"/);
  });
});
