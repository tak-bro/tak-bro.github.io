# Home design

Scope: the home route only (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`). Docs, blog and
projects keep the fumadocs layout. Two pieces reach outside it: the skip link sits in `app/root.tsx`
(it must come before the nav, and renders on the home routes only), and the nav hover treatment
applies to the shared home-layout header on every page that uses it.

## Brief

- Subject: Hyungtak Jin (진형탁), frontend engineer. Web, React Native and Electron since 2018, after
  C++ ultrasound software. No employer names (the sensitive gate blocks them).
- Audience: developers who run coding agents.
- Job: show that this is a docs site for a working agent setup, then send the reader to the
  principles guide or the guide index.
- Concept: a docs landing page. Same chrome, tokens and type as the docs; no display type, no dark
  set piece.

## Direction

Dealt by the tasteskill draw (`quiet-instrument`, seed 803265346, sector dev-tool, palette and type
kept from the brand). Both dealt heroes needed full-bleed photographs that do not exist, so the hero
is the direction's own `control-reads-the-page` blueprint instead.

```
Idea:        This page's own acceptance contract becomes the control that reads the page.
Live thing:  The hero panel measures four criteria on the live page (headline lines, body
             contrast, guide links, nav links) and prints PASS or FAIL with one evidence line.
             It runs once fonts load and again on "Run the checks", so the verdict follows the
             theme toggle and the viewport.
Pictures:    Interface fragments only (`data-ui`): the checks panel, a real hook block from
             this branch, the /orch session per stage, and the guide preview built from each
             guide's own description and headings.
```

House rules from the skill that this page follows: no eyebrows, no index numbers (the guides are no
longer numbered), no monospace outside `<pre>`/`<code>`, no hairlines, no gradients, no shadows at
rest. The fumadocs header keeps its bottom border because the docs pages share it.

## System

- Palette: the fumadocs light and dark tokens. Fields step by tone only: page `--color-fd-background`,
  field `--color-fd-card`, fragments back on `--color-fd-background`. One accent, `--color-brand`, on
  the primary button and on a guide row's dot under the pointer.
- Type: Pretendard Variable; code face = system mono with Pretendard for Hangul, inside fragments only.
  Sizes: title `clamp(2rem, 3.2vw, 2.75rem)`, headings and statements 24px, body 17px, secondary 15px,
  code 13–15px.
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem). Sections 128px apart.
- Shape: radius 4px on buttons, 6px on fields and fragments.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The first screen rises by transform only (painted
  on the first frame); check rows rise again on each run. Sections below the fold rise in once
  (opacity and 24px). The pinned session crossfades between stages (0.6s); the guide preview settles in
  when it changes. All of it is off under reduced motion, and nothing is hidden without script.
- Hover: the primary button inverts; text links darken their underline and nudge the arrow; guide rows
  and records take the field tone; nav links draw an accent underline.

## Sections

```
HERO     title, lede, [Start with the principles]  All guides →  |  field: checks panel (live)
INTRO    "A command instead of done": four paragraphs           |  field: hook block session
STAGES   five statements, the middle one in full ink            |  pinned session, crossfades
GUIDES   two groups of rows: dot, title, blurb, last-commit date |  preview of the row pointed at
ABOUT    facts column | bio paragraph | Tools · Elsewhere lists
FOOTER   one line: what this is · licences · year
```

Phone (390px): the checks panel comes first, the title under it; each stage shows its session under
its statement; the guide preview is desktop only.
