import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { plainEndings } from '../../../scripts/korean-tone.mjs';
import { guideDiagrams } from '../diagrams';

const render = (Figure: ComponentType<{ lang?: string }>, lang: string) => renderToStaticMarkup(createElement(Figure, { lang }));

const named = (html: string) => {
  const ids = html.match(/aria-labelledby="([^"]+)"/)?.[1].split(' ') ?? [];
  return ids.map((id) => html.match(new RegExp(`id="${id}">([^<]*)<`))?.[1] ?? '');
};

// The home's diagram is imported by path, so it is not in the guide map.
describe.each(Object.entries(guideDiagrams))('%s', (_, Figure) => {
  it('is one named image: role img, labelled by a non-empty title and description', () => {
    for (const lang of ['ko', 'en']) {
      const html = render(Figure, lang);
      expect(html.match(/<svg[^>]*role="img"/g)).toHaveLength(1);
      const [title, description] = named(html);
      expect(title.length).toBeGreaterThan(0);
      expect(description.length).toBeGreaterThan(title.length);
    }
  });

  it('says it in the page language', () => {
    const [ko] = named(render(Figure, 'ko'));
    const [en] = named(render(Figure, 'en'));
    expect(ko).toMatch(/[가-힣]/);
    expect(en).not.toMatch(/[가-힣]/);
  });

  // The figures speak like the pages around them: 해요체, never the plain `-다`.
  it('ends no Korean label or sentence in the plain form', () => {
    const text = render(Figure, 'ko').replace(/<[^>]+>/g, '\n');
    expect(plainEndings(text)).toEqual([]);
  });

  // Dark mode follows the page only through the tokens.
  it('colours nothing with a literal', () => {
    const html = render(Figure, 'ko').replace(/<(title|desc)[^>]*>[^<]*<\/\1>/g, '');
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i);
  });
});
