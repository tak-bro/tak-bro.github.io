# Home design

This records the current build: the home of a site of setup guides for coding-agent harnesses. Who it is for and
what it must do live in [PRODUCT.md](PRODUCT.md); the direction the home was built from is
[.impeccable/surfaces/app-routes-home-tsx.md](.impeccable/surfaces/app-routes-home-tsx.md).

Scope: the home route (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`, the terminal in
`app/components/home-terminal.tsx`, styles under "Home" in `app/app.css`), and the same buttons and links on the 404
(`app/routes/not-found.tsx`), which uses the home layout and opens with `PageHeader` (`app/components/page-header.tsx`):
the title at `clamp(2rem, 3.5vw, 2.75rem)`, semibold, and one muted 17px line under it, then the primary button back
home and a text link to the guides, centred in the viewport. The docs keep the fumadocs layout. The skip link sits in
`app/root.tsx` on every page (it must come before the nav) and jumps to `#content`, or to fumadocs' `#nd-page` on the
docs.

The site is React Router 7, prerendered, with no motion library (no GSAP, no Lenis).

## Concept

```
Idea:        A terminal opens Claude Code and replays the real agent session that rebuilt this site.
Material:    Real output: `hwip cc`, the request, and lines picked from that session.
Motion verb: type. Every line types out, like the old env-tak page: commands at a person's pace, the agent's lines faster, a spinner in a line's slot until it starts.
Live thing:  The terminal, once, when it scrolls into view.
At rest:     Still. After the session the input box shows a caret that blinks four times and stays lit.
```

## System

- Palette: hwip.app's (taken from its theme CSS on 2026-11-01, the user: "테마 색상이 너무 ai 처럼 흔함. hwip.app 테마
  가져오자"), written onto the fumadocs tokens in `app/app.css` so the docs follow it. Light: ground `#fff`, ink
  `#111113`, field `#f2f2f4`, raised `#f0f0f2`, keylines `#e3e3e7`, muted text `#66666c`. Dark: ground `#000`, ink
  `#fff`, field `#151517`, raised `#232326`, keylines `#2a2a2e`, muted text `#a0a0a6`. The field tone is the terminal
  panel, the footer and the outline button's hover; muted text is the note under the terminal, the footer's licence
  line and icons at rest, and the terminal's secondary output. One accent, hwip's yellow: `--color-brand-fill`
  `#f8c200` fills the primary button with `--color-on-brand` text (`#171718` light, `#000` dark); `--color-brand`
  draws text, lines and rings — `#856600` in light mode (yellow text is unreadable on white), `#f8c200` in dark: the
  nav underline, focus rings, diagram highlights, and inside the terminal the prompt and Claude Code's own marks.
  The home uses no error tone.
- Type: Pretendard Variable everywhere on the page. System mono (with Pretendard after it for Hangul) appears only
  inside the terminal, because it is real command output; the docs use it for code. Sizes: the name (the h1)
  `clamp(3rem, 5.6vw, 5.25rem)`, bold, line height 0.98, tracking -0.04em, balanced; the lede
  `clamp(1.0625rem, 1.3vw, 1.1875rem)` at most 40ch, one line ("a developer into building software with AI agents"; 2026-11-01, the user: "소개문구는 그냥 개발자고 ai agentic 개발하는데 관심있다 이정도" — the history is in the resume, one click away, as on the old site); buttons and the footer name 15px;
  the note under the terminal and the licence line 14px; terminal text 12.5px on a phone and 13.5px from `sm`.
  Korean words break whole (`keep-all`). The name on the page is "Tak" alone in both languages (2026-11-01, the user:
  "(진형탁) 이거 없애 그냥 Tak 만"); the full name stays in the document title and description for search.
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem). From `lg` a 12-column grid with a 40px
  column gap: the hero (name, lede, actions) takes columns 1 to 5, centred against the terminal, which takes columns
  6 to 12 (a full-width terminal under a header row was tried and rejected, 2026-11-01: "레이아웃은 아까가 더 나아").
  The home lists no guides (2026-11-01, the user: "셋업 가이드가 앞에 있어야 하나"): the nav leads there. Below `lg`
  one column with 48px between blocks, hero then terminal.
- Rhythm: the hero starts 48px under the nav (64px from `lg`). The footer is the only field band: 96px above it
  (128px from `lg`), 32px inside top and bottom.
- Shape: radius 4px on buttons, footer icon links and the request line; 6px on the terminal panel and the Claude Code
  header box. Keylines in the border tone only: the terminal panel, the outline button and
  the terminal's input box. No shadows, no gradients (the nav underline is a one-colour fill sized as a line), no glow,
  no window-chrome dots, no eyebrows or index numbers.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The name, lede and actions rise in on load by transform
  only (0.5em, 0.9s, 80ms apart), so the first screen paints on the first frame; the terminal does not rise, it plays.
  Buttons press to 0.97 on `:active`. Every animation and transition lives inside
  `prefers-reduced-motion: no-preference`, and under reduced motion every transition is 0s too, the fumadocs nav and
  sidebar included. The terminal never plays under reduced motion.
- Buttons: the primary is brand on the background colour, 15px semibold, at least 44px tall, and turns to the ink
  colour on hover. The second action is the same size in outline (border tone) and takes the field tone on hover.
- Hover: footer icons take the ink colour on the accent tone; 404 text links darken their underline and nudge the
  arrow 3px; nav links draw an accent underline. The terminal has no links.
- Diagrams: the home loads none. Guide figures live in `app/components/diagrams/`, are bound to the MDX components in
  `app/components/mdx.tsx`, and stay in the docs chunk. The home's first-load JS was 205859 B gzip when this was
  written.

## Sections

```
HERO (cols 1-5, centred)          |  TERMINAL (cols 6-12)
  name (h1, display size)         |    panel: hwip cc, Claude Code header, request, six session lines,
  lede                            |      input box
  Resume (brand) ↗  GitHub (outline) ↗   note: lines picked from the session that rebuilt this site
FOOTER    field: name over "© · licences" | icon links (LinkedIn, GitHub, hwip, resume, source)
```

The footer links are 44px icon squares, muted at rest; each carries its name as `title` and a screen-reader label
(plus "opens in a new tab" when external). LinkedIn and GitHub are Simple Icons marks (lucide has no brand icons);
hwip, the resume and the site source are lucide `Smartphone`, `FileUser` and `CodeXml`.

## Terminal

The one live thing on the home, `app/components/home-terminal.tsx`, styled by the `.home-term*` rules in
`app/app.css`.

- Panel: the field tone with a border-tone keyline, radius 6px, no shadow; padding 16px by 20px on a phone, 28px by
  24px from `sm`; mono at line height 1.8. It has a screen-reader heading ("Claude Code session") and
  `aria-busy` while it plays. Decorative marks (prompt, `>`, `⏺`, `⎿`, `✻`, the caret, the spinner) are hidden from
  assistive tech.
- Content, top to bottom, every line in the prerendered HTML:
  1. `tak ~ $ hwip cc` (Claude Code started through hwip) with the prompt in the accent, then the Claude Code header: a box keylined in the accent at 60%, `✻` in the accent, "Claude
     Code" in semibold and the working directory muted.
  2. The request the user typed (`/orch …`, per language), behind a `>` on a faint ink tint (7%).
  3. Six session lines from that run, from plan to draft PR, all in the ink and muted tones. A `say` line is `⏺`
     and the agent's text. A `tool` line is `⏺` and the call in semibold, with its result lines under it, the first
     behind `⎿`, muted. The questions the user answered (what stays in the nav, how the diagrams are drawn) show as
     Claude Code shows them: "User answered Claude's questions:" and one `· question → answer` line each. Lines wrap
     on a phone.
  4. An empty input box (border tone) with a `>` and a resting caret.
- States (`data-play`):
  - `pending`: as prerendered. With motion allowed, CSS holds every line back and shows them all after 2.5s, so the
    panel reads even if script never runs.
  - `armed`: script is running and waiting; lines that have not played are `visibility: hidden`, so the panel keeps
    its size and nothing reflows. It plays once, when the panel's top passes three quarters of the viewport height (a line, not a ratio of the panel, so a panel taller than a zoomed-in viewport still plays).
  - `playing`: every line types out. Commands (`hwip cc`, the request) type one character at a time (300ms before
    the first, then about 42 to 74ms each, 280ms after the last). The header box appears 300ms after `hwip cc`. The
    agent's lines stream two characters every 22ms: a session line starts 420ms after the line before it, a tool
    result 160ms after its call, and each waits 120ms after its last character; the input box comes last. Until an
    agent line's first character, a spinner (`·✢✳✶✻✽`, 110ms a frame) and "Orchestrating…" in the accent hold its
    slot. While a line types, the caret sits at its end and the
    untyped rest stays invisible in place.
  - `done`: everything shows. Reduced motion, or a browser without IntersectionObserver, goes straight here.
- The resting caret blinks four times (1.1s each, under five seconds) and then stays lit.

## Checks

- `pnpm check`: sensitive words, guides (해요체 and diagram pairs, `scripts/check-guides.mjs`), types, tests (home
  loader guides, copy symmetry, Korean home tone, diagrams, resume per language, nav), build, links and required
  files.
- `node .claude/20261031/site-ui-rebuild/hero-qa.mjs` (build served on :4400): first screen and footer at 1440 and
  390 in Korean and 1440 in English, and page errors. `full-qa.mjs`: full pages after scrolling, overflow, and a
  reduced-motion pass. `404-qa.mjs`: the 404 in both languages (serves the build itself on :4401). The folder is
  local, not in git.
- `node .claude/20261101/guides/guides-qa.mjs ac3` (needs a build): its tone checks (no plain `-다` ending in the
  Korean home and the docs introduction), first-load JS budget (218196 B gzip) and page errors still apply. It also
  asserts one diagram on the home; the redesign removed that diagram on purpose, so that assertion fails and is
  stale, not a regression.
