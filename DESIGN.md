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
docs. The language menu in the nav and the docs sidebar (`app/components/language-select.tsx`, a wrapper on
fumadocs' own) closes the moment a language is picked (2026-11-01, the user: "언어 선택시 바로 툴팁 사라지게 해").

The site is React Router 7, prerendered, with no motion library (no GSAP, no Lenis).

## Concept

```
Idea:        A terminal opens Claude Code and plays a typical /orch run, from request to draft PR.
Material:    Claude Code's own marks and the workflow's real steps (plan, slice review, verify, ship) on an
             illustrative task (2026-11-01, the user: "꼭 내가 했던걸로 하지말고, 그럴싸한걸로 하자").
Motion verb: type. Every line types out, like the old env-tak page: commands at a person's pace, the agent's lines faster, a spinner in a line's slot until it starts.
Live thing:  The terminal, once, when it scrolls into view.
At rest:     Still. After the session the input box shows a caret that blinks four times and stays lit.
```

## System

- Palette: GMK 9009, picked from the keycap colour codes on matrixzj.github.io/docs/gmk-keycaps (2026-11-01, the
  user, after rejecting hwip.app's greys and yellow), written onto the fumadocs tokens in `app/app.css` so the docs
  follow it. Dark is the set itself: ground `#171718` (CR), ink `#d8d2c3` (L9), field `#202021`, raised `#2a2a2b`,
  keylines `#393b3b` (N9), muted text `#aca693` (U9). Light keeps the charcoal ink `#171718` on a neutral grey after
  the set's cool grey 2M, because the set's own cream read too creamy (the user: "라이트테마일때가 별로네 너무
  크리미함"): ground `#f6f6f5`, field `#ebecea`, raised `#e2e3e1`, keylines `#c6c9c7` (2M), muted text `#5e6060`.
  The field tone is the terminal panel and the footer; muted text is the footer's licence line and icons at rest, and the terminal's secondary output. One accent, the set's
  salmon (3C): `--color-brand-fill` `#c87e74` fills the primary button with `--color-on-brand` `#171718` text
  (5.7:1); `--color-brand` draws text, lines and rings — `#9c4f45` in light mode (the fill is under 3:1 as text on
  grey), `#c87e74` in dark: the nav underline, focus rings, diagram highlights, and inside the terminal the prompt and
  Claude Code's own marks. The home uses no error tone.
- Type: Pretendard Variable everywhere on the page. System mono (with Pretendard after it for Hangul) appears only
  inside the terminal, because it is command output; the docs use it for code. Sizes: the name (the h1)
  `clamp(3rem, 5.6vw, 5.25rem)`, bold, line height 0.98, tracking -0.04em, balanced; the lede
  `clamp(1.0625rem, 1.3vw, 1.1875rem)` at most 40ch, one line ("a developer into building software with AI agents"; 2026-11-01, the user: "소개문구는 그냥 개발자고 ai agentic 개발하는데 관심있다 이정도" — the history is in the resume, one click away, as on the old site); buttons and the footer name 15px;
  the licence line 14px; terminal text 12.5px on a phone and 13.5px from `sm`.
  Korean words break whole (`keep-all`). The name on the page is "Tak" alone in both languages (2026-11-01, the user:
  "(진형탁) 이거 없애 그냥 Tak 만"); the full name stays in the document title and description for search.
- Frame: `.home-frame` is the nav's frame: as wide as fumadocs' layout width (`--fd-layout-width`, 1400px), centred,
  16px side padding, so the name lines up with the nav logo at every width. The hero section grows to fill the
  viewport, so the footer sits on the bottom edge on a tall or wide screen. From `lg` a 12-column grid with a 40px
  column gap: the hero (name, lede, actions) takes columns 1 to 5, centred against the terminal, which takes columns
  6 to 12 (a full-width terminal under a header row was tried and rejected, 2026-11-01: "레이아웃은 아까가 더 나아").
  The home lists no guides (2026-11-01, the user: "셋업 가이드가 앞에 있어야 하나"): the hero's one button, "Tak's
  config", leads there, and the nav carries the resume and GitHub (2026-11-01, the user: "Config 버튼을 대표로 주고
  네브에 이력서 깃허브를 추가할까"; visitors mostly arrive from the resume, so the guides are what is new to them). The
  docs sidebar carries no nav links ("이력서, 깃허브 쌩뚱맞고"). Below `lg`
  one column with 48px between blocks, hero then terminal.
- Rhythm: the hero starts 48px under the nav (64px from `lg`). The footer is the only field band: 96px above it
  (128px from `lg`), 24px inside top and bottom.
- Shape: radius 4px on buttons, footer icon links and the request line; 6px on the terminal panel and the Claude Code
  header box. Keylines in the border tone only: the terminal panel and the terminal's input box. No shadows, no gradients (the nav underline is a one-colour fill sized as a line), no glow,
  no window-chrome dots, no eyebrows or index numbers.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The name, lede and actions rise in on load by transform
  only (0.5em, 0.9s, 80ms apart), so the first screen paints on the first frame; the terminal does not rise, it plays.
  Buttons press to 0.97 on `:active`. Every animation and transition lives inside
  `prefers-reduced-motion: no-preference`, and under reduced motion every transition is 0s too, the fumadocs nav and
  sidebar included. The terminal never plays under reduced motion.
- Buttons: the primary is brand on the background colour, 15px semibold, at least 44px tall, and turns to the ink
  colour on hover. The hero has only this one, an internal link to the guides with a right arrow.
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
  Tak's config (brand) →
FOOTER    field, one row: "© · licences" | icon links (LinkedIn, GitHub, site source)
```

The footer links are 44px icon squares, muted at rest; each carries its name as `title` and a screen-reader label
plus "opens in a new tab". LinkedIn and GitHub are Simple Icons marks (lucide has no brand icons); the site source
is lucide `CodeXml`. The footer repeats nothing the page already shows: no name (the nav logo and the h1 carry it), no
resume (the nav), no hwip (2026-11-01, the user: "푸터에 쓸데없는거 많지않아? hwip.app은 빼자").

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
  2. The request (`/orch …`, per language: refresh an expired token on its own), behind a `>` on a faint ink tint (7%).
  3. Six session lines, from plan to draft PR, all in the ink and muted tones. A `say` line is `⏺`
     and the agent's text. A `tool` line is `⏺` and the call in semibold, with its result lines under it, the first
     behind `⎿`, muted. The questions the user answered (what happens when the refresh fails, how parallel requests wait) show as
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
  loader guides, copy symmetry, Korean home tone, diagrams, nav links and resume per language), build, links and required
  files.
- `node .claude/20261031/site-ui-rebuild/hero-qa.mjs` (build served on :4400): first screen and footer at 1440 and
  390 in Korean and 1440 in English, and page errors. `full-qa.mjs`: full pages after scrolling, overflow, and a
  reduced-motion pass. `404-qa.mjs`: the 404 in both languages (serves the build itself on :4401). The folder is
  local, not in git.
- `node .claude/20261101/guides/guides-qa.mjs ac3` (needs a build): its tone checks (no plain `-다` ending in the
  Korean home and the docs introduction), first-load JS budget (218196 B gzip) and page errors still apply. It also
  asserts one diagram on the home; the redesign removed that diagram on purpose, so that assertion fails and is
  stale, not a regression.
