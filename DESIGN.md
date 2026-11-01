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
Material:    Real output: `claude`, the request, and lines picked from that session.
Motion verb: type. Every line types out, like the old env-tak page: commands at a person's pace, the agent's lines faster, a spinner in a line's slot until it starts.
Live thing:  The terminal, once, when it scrolls into view.
At rest:     Still. After the session the input box shows a caret that blinks four times and stays lit.
```

## System

- Palette: the fumadocs light and dark tokens. One ground `--color-fd-background`, one ink `--color-fd-foreground`,
  the field tone `--color-fd-card` for the terminal panel, the footer and the outline button's hover. Keylines are
  `--color-fd-border`. Muted text `--color-fd-muted-foreground` (overridden to `hsl(0, 0%, 35%)` in light mode for
  4.5:1 on the card) for the guides heading, guide lines, the note under the terminal, the licence line and the
  terminal's secondary output. One accent, `--color-brand` (`oklch(0.52 0.16 42)` light, `oklch(0.76 0.14 55)` dark):
  the primary button, the nav underline, focus rings, and inside the terminal the prompt and Claude
  Code's own marks (see Terminal). `--color-fd-error` only on a hook that blocked something (overridden to `oklch(0.5 0.2 27)` in light mode for 4.5:1 on the card).
- Type: Pretendard Variable everywhere on the page. System mono (with Pretendard after it for Hangul) appears only
  inside the terminal, because it is real command output; the docs use it for code. Sizes: the name (the h1)
  `clamp(min(3rem, 13vw), 5.6vw, 5.25rem)` (the floor drops under 3rem below about 370px wide, so "(Hyungtak Jin)" fits 320px), bold, line height 0.98, tracking -0.04em, balanced; the lede
  `clamp(1.0625rem, 1.3vw, 1.1875rem)` at most 40ch; buttons, guide rows, the guides heading and the footer 15px;
  the note under the terminal and the licence line 14px; terminal text 12.5px on a phone and 13.5px from `sm`.
  Korean words break whole (`keep-all`); "Tak (Hyungtak Jin)" breaks only before the parenthesis.
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem). From `lg` a 12-column grid with a 40px
  column gap and a 32px row gap: the hero (name, lede, actions) and the guides list share columns 1 to 5, the
  terminal takes columns 6 to 12 across both rows, top-aligned with the name. Below `lg` one column with 48px between
  blocks, in the order hero, terminal, guides.
- Rhythm: the hero starts 48px under the nav (64px from `lg`). The footer is the only field band: 96px above it
  (128px from `lg`), 64px inside its top (80px from `lg`).
- Shape: radius 4px on buttons, guide rows and the request line; 6px on the terminal panel and the Claude Code
  header box. Keylines in the border tone only: the terminal panel, the rule above the guides, the outline button and
  the terminal's input box. No shadows, no gradients (the nav underline is a one-colour fill sized as a line), no glow,
  no window-chrome dots, no eyebrows or index numbers.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The name, lede, actions and guides rise in on load by transform
  only (0.5em, 0.9s, 80ms apart), so the first screen paints on the first frame; the terminal does not rise, it plays.
  Buttons press to 0.97 on `:active`. Every animation and transition lives inside
  `prefers-reduced-motion: no-preference`, and under reduced motion every transition is 0s too, the fumadocs nav and
  sidebar included. The terminal never plays under reduced motion.
- Buttons: the primary is brand on the background colour, 15px semibold, at least 44px tall, and turns to the ink
  colour on hover. The second action is the same size in outline (border tone) and takes the field tone on hover.
- Hover: footer and 404 text links darken their underline and nudge the arrow 3px; guide rows nudge their arrow; nav
  links draw an accent underline; a terminal session line lights its guide name in the accent.
- Diagrams: the home loads none. Guide figures live in `app/components/diagrams/`, are bound to the MDX components in
  `app/components/mdx.tsx`, and stay in the docs chunk. The home's first-load JS was 205859 B gzip when this was
  written.

## Sections

```
HERO + GUIDES (cols 1-5)          |  TERMINAL (cols 6-12)
  name (h1, display size)         |    panel: claude, request, seven session lines, input box
  lede: since 2018, now writes    |    note: lines picked from the session that rebuilt this site
    the rules for coding agents   |
  Resume (brand) ↗  GitHub (outline) ↗
  ── guides heading
  7 rows: title → | one line
FOOTER    field: name, links (LinkedIn, GitHub, hwip, resume, source), licences, ©
```

Guide rows put the title in a 9.5rem column and the line beside it; on a phone the line goes under the title. Only
guides whose page exists are listed (the loader checks), so `check:links` never meets a link to an unwritten guide.

## Terminal

The one live thing on the home, `app/components/home-terminal.tsx`, styled by the `.home-term*` rules in
`app/app.css`.

- Panel: the field tone with a border-tone keyline, radius 6px, no shadow; padding 16px by 20px on a phone, 28px by
  24px from `sm`; mono at line height 1.8. It has a screen-reader heading ("Claude Code session") and
  `aria-busy` while it plays. Decorative marks (prompt, `>`, `⏺`, `⎿`, `✻`, the caret, the spinner) are hidden from
  assistive tech.
- Content, top to bottom, every line in the prerendered HTML:
  1. `tak ~ $ claude` with the prompt in the accent, then the Claude Code header: a box keylined in the accent at 60%, `✻` in the accent, "Claude
     Code" in semibold and the working directory muted.
  2. The request the user typed (`/orch …`, per language), behind a `>` on a faint ink tint (7%).
  3. Seven session lines from that run, from plan to draft PR. A `say` line is `⏺` and the agent's text. A `tool`
     line is `⏺` and the call in semibold, with its result under it behind `⎿`, muted. The blocked commit hook
     colours its `⏺` and its result in the error tone. From `sm`, each line ends with the name of the guide that
     explains it, in the sans face, muted; on a phone guide names are dropped and lines wrap.
  4. An empty input box (border tone) with a `>` and a resting caret.
- States (`data-play`):
  - `pending`: as prerendered. With motion allowed, CSS holds every line back and shows them all after 2.5s, so the
    panel reads even if script never runs.
  - `armed`: script is running and waiting; lines that have not played are `visibility: hidden`, so the panel keeps
    its size and nothing reflows. It plays once, when the panel's top passes three quarters of the viewport height (a line, not a ratio of the panel, so a panel taller than a zoomed-in viewport still plays).
  - `playing`: every line types out. Commands (`claude`, the request) type one character at a time (300ms before
    the first, then about 42 to 74ms each, 280ms after the last). The header box appears 300ms after `claude`. The
    agent's lines stream two characters every 22ms: a session line starts 420ms after the line before it, a tool
    result 160ms after its call, and each waits 120ms after its last character; the input box comes last. Until an
    agent line's first character, a spinner (`·✢✳✶✻✽`, 110ms a frame) and "Orchestrating…" in the accent hold its
    slot. A line's guide name shows once the line has finished. While a line types, the caret sits at its end and the
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
