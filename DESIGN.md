# Home design

This records the current build. The brief a redesign starts from is [SITE-BRIEF.md](SITE-BRIEF.md).

Scope: the home route (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`), and the same type,
links and buttons on the other pages that use the home layout. Blog, projects, blog posts, projects
and the 404 open with `PageHeader` (`app/components/page-header.tsx`): an optional way back, the
title at `clamp(2rem, 3.5vw, 2.75rem)` and one line under it; rows and cards take the field tone on
hover, with no rules between them. Blog posts carry their table of contents in a right rail from
64rem. The docs keep the fumadocs layout. The skip link sits in `app/root.tsx` on every page (it must
come before the nav); it jumps to `#content`, or to fumadocs' `#nd-page` on the docs.

## Brief

- Subject: Hyungtak Jin (진형탁), frontend engineer. Web, React Native and Electron since 2018, after
  C++ ultrasound software. No employer names (the sensitive gate blocks them).
- Audience: developers who run coding agents.
- Job: show who this developer is and how they run agents (Claude Code, pi and opencode on one
  setup, hwip on the phone), then send the reader to the principles guide or the guide index.
- Concept: a setup showcase. One screen says whose setup this is; every section below is cards with a
  title and one line, and the long explanations live in the guides. It is neither a blog nor a docs
  index. Same chrome, tokens and type as the docs.

## Direction

Dealt by the tasteskill draw (`quiet-instrument`, seed 803265346, sector dev-tool, palette and type
kept from the brand). Two earlier builds were rejected: a docs landing with a self-checking panel read
as a guide index, and a long philosophy page read as an essay. The copy is now cut to one line per item.

```
Idea:        The enforcement spectrum of the agent setup (permission, deny, hook, gate,
             isolation, request) becomes the page's ladder.
Live thing:  Picking a layer shows the real file or output behind it.
Pictures:    Interface fragments only (`data-ui`): the hook block in the hero, a fragment per
             way of working (terminal sessions and a hwip push on a phone), the layer example.
```

House rules from the skill that this page follows: no eyebrows, no index numbers (the guides are no
longer numbered), no monospace outside `<pre>`/`<code>`, no hairlines, no gradients, no shadows at
rest. The fumadocs header keeps its bottom border because the docs pages share it.

## System

- Palette: the fumadocs light and dark tokens. Fields step by tone only: page `--color-fd-background`,
  field `--color-fd-card`, fragments back on `--color-fd-background`. One accent, `--color-brand`, on
  the primary button and on the picked layer's bar.
- Type: Pretendard Variable; code face = system mono with Pretendard for Hangul, inside fragments only.
  Sizes: title `clamp(2rem, 3.2vw, 2.75rem)`, headings and statements 24px, body 17px, secondary 15px,
  code 13–15px.
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem). Sections 128px apart.
- Shape: radius 4px on buttons, 6px on fields and fragments.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The first screen rises by transform only (painted
  on the first frame). Sections below the fold rise in once
  (opacity and 24px). The layer example settles in when it changes. All of it is off under reduced motion, and nothing is hidden without script.
- Hover: the primary button inverts; text links darken their underline and nudge the arrow; layers take the field tone, cards the accent tone; nav links draw an accent underline.

## Sections

```
HERO     title, one-line lede, tool chips, [See the setup]  GitHub ↗  |  field: hook block
WORK     four cards: /orch, hwip, /team, draft PR, each a line and a fragment
LAYERS   six layers, bar length = strength, one line each        |  example of the picked layer
GUIDES   cards: title, one line, last-commit date
FOOTER   colour field: one about line, links (GitHub, hwip, resume, source), licences
```

Phone (390px): the title comes first, the hook block under it; cards stack; the picked layer shows its
example under the row.
