import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The fumadocs slots need the whole docs layout to render; the stand-ins keep what this module
// controls: the container props it passes, and the <header> the popover draws.
vi.mock('fumadocs-ui/layouts/docs/page/slots/toc', async () => {
  const { createElement: h } = await import('react');
  return {
    TOC: ({ container }: { container?: Record<string, unknown> }) => h('div', container),
    TOCPopover: () => h('header'),
    TOCProvider: () => null,
  };
});

const locale = vi.hoisted(() => ({ value: undefined as string | undefined }));
vi.mock('fumadocs-ui/contexts/i18n', () => ({ useI18n: () => ({ locale: locale.value }) }));

const { docsTocSlots } = await import('../toc');

const render = (slot: 'main' | 'popover') => renderToStaticMarkup(createElement(docsTocSlots[slot], {}));

// axe: the TOC had no landmark, and the phone popover's <header> was a second banner.
describe('docsTocSlots', () => {
  beforeEach(() => {
    locale.value = undefined;
  });

  it('names the desktop table of contents as a navigation landmark by its title', () => {
    expect(render('main')).toMatch(/role="navigation"/);
    expect(render('main')).toMatch(/aria-labelledby="toc-title"/);
  });

  it('puts the popover header inside a nav element named in the page language', () => {
    expect(render('popover')).toMatch(/^<nav aria-label="이 페이지에서"[^>]*><header>/);
    locale.value = 'en';
    expect(render('popover')).toMatch(/^<nav aria-label="On this page"[^>]*><header>/);
  });
});
