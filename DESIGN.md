# Home design

This records the current build: the home as a hiring portfolio. The brief it was built from is
[SITE-BRIEF.md](SITE-BRIEF.md); positioning lives in [.agents/product-marketing.md](.agents/product-marketing.md).

Scope: the home route (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`), and the same type,
links and buttons on the other pages that use the home layout. Blog, projects, blog posts, projects
and the 404 open with `PageHeader` (`app/components/page-header.tsx`): an optional way back, the
title at `clamp(2rem, 3.5vw, 2.75rem)` and one line under it; rows and cards take the field tone on
hover, with no rules between them. Blog posts carry their table of contents in a right rail from
64rem. The docs keep the fumadocs layout. The skip link sits in `app/root.tsx` on every page (it must
come before the nav); it jumps to `#content`, or to fumadocs' `#nd-page` on the docs.

## Brief

- Subject: Tak (Hyungtak Jin, 진형탁), AI and DX engineer. Web, React Native and Electron since 2018.
  No employer names (the sensitive gate blocks them).
- Audience: people hiring, who arrive from the resume or LinkedIn and decide within five minutes. A
  recruiter wants who, what and the resume; a frontend lead wants to know AI code will not pile up
  unreviewed; a CTO or EM wants to know the practice spreads to a team.
- Job: one question answered, "does this person ship faster with AI and still control quality?",
  then the resume opened and a LinkedIn message sent.
- Not a blog, not a docs index, not a setup showcase (SITE-BRIEF §7 has why each was dropped).

## Concept

```
Idea:        Every claim stands next to the real output it rests on.
Material:    Terminal output, rule files, the enforcement ladder: what an agent setup actually prints.
Signature:   An output fragment prints line by line when it enters, like a terminal; the line a hook
             blocked is red.
Motion verb: print. Lines step in, short and linear; nothing bounces.
Live thing:  None. The page is quiet on purpose: a recruiter reads it in five minutes, and the
             guides are where someone goes to dig.
At rest:     Still. Nothing moves while the pointer is still; hovers and the print carry the life.
```

The evidence is framed as the questions a hiring lead would ask (product-marketing's objections), not
as feature names, so the page answers a reader instead of listing tools.

## System

- Palette: the fumadocs light and dark tokens. One ground `--color-fd-background`, one ink
  `--color-fd-foreground`, the field tone `--color-fd-card` for the profile, the output fragments,
  the team band and the close. Muted text `--color-fd-muted-foreground` (35% grey in light, 4.5:1+)
  for questions, terms and secondary lines only. One accent, `--color-brand`, on the primary button
  and the strongest layer's bar. Hook lines in the output use red-700 / red-300.
- Type: Pretendard Variable; code face = system mono with Pretendard for Hangul, inside `<pre>` only.
  Sizes: headline `clamp(2rem, 6.2vw, 6rem)` at tracking -0.035em, contact line `clamp(2rem, 4.5vw, 4rem)`,
  section headings `clamp(1.75rem, 3vw, 2.5rem)`, claims `clamp(1.5rem, 2.2vw, 2rem)`, body 17px,
  secondary 15px, code 12.5–13px. Headlines balance (`text-wrap: balance`) and stay within two lines
  at 390, 1440 and in both languages.
- Frame: one pair of outer margins (`.home-frame`: 24px, 40px from 64rem) and a 12-column grid with a
  40px gutter from 64rem. Two left edges on the whole page: the margin, and column 7 for every
  second column (profile, output fragments, the ladder, the guide rows).
- Rhythm: about 128–192px between sections on desktop, 80–112px on a phone. Section grounds alternate:
  page, page, field band, page, field close.
- Shape: radius 4px on buttons, 6px on fields and fragments. No rules, shadows, gradients, eyebrows,
  index numbers or monospace outside code.
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. The first screen rises by transform only (painted
  on the first frame). Below the fold, blocks rise in once (opacity and 24px) and output lines print
  70ms apart. All of it lives inside `prefers-reduced-motion: no-preference`; the reveal script does
  not run under reduced motion, and nothing is hidden without script. No motion library.
- Hover: the primary button inverts and presses; text links darken their underline and nudge the
  arrow; guide rows take the field tone and nudge the arrow; nav links draw an accent underline.
  Output fragments take focus (they scroll sideways from `sm` up) and show a brand outline.

## Sections

```
HERO      h1 = name + role / headline (full width, two lines)
          lede + [Resume ↗] LinkedIn ↗ GitHub ↗        |  profile field: experience, position,
                                                          harnesses, built (hwip ↗)
EVIDENCE  heading                                      |  one line on the same baseline
          × 3 rows: question · claim · body · guide →  |  output fragment (source name + terminal)
            1 What if an agent breaks a rule?  → the blocked commit (commit-convention.py)
            2 Won't unreviewed code pile up?   → /orch → slice gates → gh pr create --draft
            3 Doesn't it stay personal?        → RULES.md read by three harnesses, and their hooks
TEAM      field band: heading, three practices          |  ladder card: six layers, bar = strength,
          a team can take over                          |  All principles →
GUIDES    heading + one line                            |  index rows: title →, line, last commit date
CLOSE     field: contact line set large, one line, [Resume ↗] LinkedIn ↗
          about line, links (LinkedIn, GitHub, hwip, resume, older posts, source), licences
```

Phone (390px): name, headline (two lines), lede and the buttons fill the first screen; the profile
field follows. Evidence rows stack the text over the fragment, and the fragment's lines wrap instead
of scrolling. The ladder drops the third column under the layer name. Guide rows put the line under
the title with the date at the right.

## Checks

- `node .claude/20261031/site-ui-rebuild/hero-qa.mjs` (build served on :4400): first screen at 1440
  and 390 in Korean and 1440 in English, and page errors. The folder is local, not in git.
- `pnpm check`: sensitive words, types, tests (home copy symmetry, three pieces of evidence, resume
  per language), build, links.
