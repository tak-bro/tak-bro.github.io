# Home design

This records the current build: the home of a site of setup guides for coding-agent harnesses. The brief it was built from is [SITE-BRIEF.md](SITE-BRIEF.md); positioning lives in
[.agents/product-marketing.md](.agents/product-marketing.md).

Scope: the home route (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`), and the same type,
links and buttons on the 404, which uses the home layout and opens with `PageHeader`
(`app/components/page-header.tsx`): an optional way back, the title at `clamp(2rem, 3.5vw, 2.75rem)`
and one line under it. The site has no posts or project pages. The docs keep the fumadocs layout; their table of contents is a
named nav (`app/components/toc.tsx`) and each table scrolls in a focusable wrapper. The skip link sits in
`app/root.tsx` on every page (it must come before the nav); it jumps to `#content`, or to fumadocs'
`#nd-page` on the docs.

## Brief

- Subject: Tak (Hyungtak Jin, 진형탁). Web, React Native and Electron since 2018; now works through
  Claude Code, opencode and pi with his own rules, hooks and skills. No employer names (the sensitive
  gate blocks them).
- Audience: people who work with coding agents, and people who arrive from the resume or LinkedIn
  and want to know what this person does. The home does not address recruiters; the resume sits in
  the nav and LinkedIn in the footer.
- Job: the topic in one line, then a guide opened, where the real config is.
- Not a hiring pitch, not a docs index, not a setup showcase (SITE-BRIEF §7 has why each was dropped).

## Concept

```
Idea:        A guide, not a pitch: the topic, then the guides.
Material:    Rule files and config: what an agent setup actually reads. It lives in the guides.
Motion verb: rise. Blocks below the fold rise in once; nothing bounces.
Live thing:  None. The page is a quiet index; the guides are where someone goes to read.
At rest:     Still. Nothing moves while the pointer is still; hovers carry the life.
```

## System

- Palette: the fumadocs light and dark tokens. One ground `--color-fd-background`, one ink
  `--color-fd-foreground`, the field tone `--color-fd-card` for row hovers and the footer. Muted
  text `--color-fd-muted-foreground` (35% grey in light, 4.5:1+) for ledes, row lines, dates and the
  licence line. One accent, `--color-brand`, on the primary button and the nav underline.
- Type: Pretendard Variable; code face = system mono with Pretendard for Hangul, inside `<pre>` only.
  Sizes: headline `clamp(2rem, 6.2vw, 6rem)` at tracking -0.035em, section headings
  `clamp(1.75rem, 3vw, 2.5rem)`, row titles 19px, body 17px, secondary 15px, code 12.5–13px.
  Headlines balance (`text-wrap: balance`); the Korean headline stays within two lines at 390 and
  1440, the English one within three ("coding‑agent" carries a non-breaking hyphen).
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem) and a 12-column grid with a
  40px gutter from 64rem. Two left edges on the whole page: the margin, and column 7 for the guide
  list.
- Rhythm: on desktop 160px above the guides and the footer (112px on a phone), the hero 64px under
  the nav on desktop. The footer is the only field band.
- Shape: radius 4px on buttons, 6px on fields and rows. No rules, shadows, gradients,
  eyebrows, index numbers or monospace outside code.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The first screen rises by transform only (painted
  on the first frame). Below the fold, blocks rise in once (opacity and 24px). All of it lives inside `prefers-reduced-motion: no-preference`; the reveal script does
  not run under reduced motion, and nothing is hidden without script. Under reduced motion every
  transition is 0s too (`app.css`), the fumadocs nav and sidebar included. No motion library.
- Hover: text links darken their underline and nudge the arrow; index rows take the field tone and
  nudge the arrow; nav links draw an accent underline.

## Sections

```
HERO      name (small line)
          h1 = the topic, two lines in Korean
          lede: since 2018, now three harnesses with my own rules, hooks and skills
          Resume ↗  GitHub ↗
GUIDES    heading, lede                            |  6 rows: title → | line | last commit date
FOOTER    field: name, links (LinkedIn, GitHub, hwip, resume, source), licences
```

Guide titles are short and take a column from `sm`. Phone (390px): rows put the date at the right of
the title and the line under both.

## Checks

- `node .claude/20261031/site-ui-rebuild/hero-qa.mjs` (build served on :4400): first screen at 1440
  and 390 in Korean and 1440 in English, and page errors. `full-qa.mjs`: full pages, pending reveals,
  overflow, reduced motion. `404-qa.mjs`: the 404 in both languages. The folder is local, not in git.
- `pnpm check`: sensitive words, types, tests (home loader guides, copy symmetry, resume per language,
  nav), build, links and images.
