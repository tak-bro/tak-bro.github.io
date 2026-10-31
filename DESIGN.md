# Home design

Scope: the home route only (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`). Docs, blog and
projects keep the fumadocs layout. Two pieces reach outside it: the skip link sits in `app/root.tsx`
(it must come before the nav, and renders on the home routes only), and the nav hover treatment
applies to the shared home-layout header on every page that uses it.

## Brief

- Subject: Hyungtak Jin (진형탁), frontend engineer. Web, React Native and Electron since 2018, after
  C++ ultrasound software. No employer names (the sensitive gate blocks them).
- Audience: developers who run coding agents.
- Job: show who this developer is and how they run agents (Claude Code, pi and opencode on one
  setup, hwip on the phone), then send the reader to the principles guide or the guide index.
- Concept: a personal page built on one philosophy from the agent-config repo: structure, not
  requests. Same chrome, tokens and type as the docs; no display type, no dark set piece.

## Direction

Dealt by the tasteskill draw (`quiet-instrument`, seed 803265346, sector dev-tool, palette and type
kept from the brand). The first docs-landing build (a self-checking hero panel) was rejected as a
docs index; the content was rebuilt around the owner's philosophy, keeping the direction.

```
Idea:        The enforcement spectrum of the agent setup (permission, deny, hook, gate,
             isolation, request) becomes the page's ladder.
Live thing:  Picking a layer shows the real file or output behind it (the explorer agent's
             tools line, the settings ask list, a commit a hook stopped while this page was
             built, a gate verdict, the SessionStart injection, a RULES.md line).
Pictures:    Interface fragments only (`data-ui`): the hook block in the hero, the layer
             example, the scenes of a day (terminal sessions and a hwip push on a phone),
             and the guide preview built from each guide's own description and headings.
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
  on the first frame). Sections below the fold rise in once
  (opacity and 24px). The pinned fragment crossfades between scenes (0.6s); the layer example and the guide preview settle in
  when they change. All of it is off under reduced motion, and nothing is hidden without script.
- Hover: the primary button inverts; text links darken their underline and nudge the arrow; guide rows, layers
  and records take the field tone; nav links draw an accent underline.

## Sections

```
HERO        title, lede, tool chips, [Read the principles]  All guides →  |  field: hook block
LAYERS      six layers, strongest first, bar length = strength          |  example of the picked layer
SCENES      four statements: /orch, hwip push, /team, draft PR           |  pinned fragment, crossfades
PRINCIPLES  six cards in a 3-column grid, link to the principles guide
TRY         intro | three numbered steps
GUIDES      two groups of rows: dot, title, blurb, last-commit date      |  preview of the row pointed at
ABOUT       facts column | bio paragraph | Built · Elsewhere lists
FOOTER      one line: what this is · licences · year
```

Phone (390px): the title comes first, the hook block under it; the picked layer and each scene show
their fragment under the row; the guide preview is desktop only.
