# Home design

Scope: the home route only (`app/routes/home.tsx`, copy in `app/lib/home-copy.ts`). Docs, blog and
projects keep the fumadocs layout. Two pieces reach outside it: the skip link sits in `app/root.tsx`
(it must come before the nav, and renders on the home routes only), and the nav hover treatment
applies to the shared home-layout header on every page that uses it.

## Brief

- Subject: Hyungtak Jin (진형탁), frontend engineer. Web, React Native and Electron since 2018, after
  C++ ultrasound software. No employer names (the sensitive gate blocks them).
- Audience: developers who run coding agents, and people checking who I am.
- Job: show in three seconds that this site documents a working agent setup, then send the reader
  to a guide.
- Theatre: quiet. No loader, no WebGL, no smooth-scroll library. Craft lives in type, layout and
  one scroll-driven section.

## Concept card

```
Idea:        One line goes in, a draft PR comes out, and the site shows the path between.
Metaphor:    A command line: a prompt, a cursor, and output that advances one line at a time.
Signature:   A dark sticky section. The left column holds one giant word for the current stage
             (선언, 플랜, 리뷰, PR, 머지); scrolling the right column advances it, and a dot
             walks down a five-stop rail.
Emotion:     Calm and exact, like watching a run you trust.
Motion verb: Advance like a cursor: short, forward, settling. Nothing floats.
Screenshot:  The hero: two lines of mega type over the prompt bar with a blinking cursor.
```

Anchor: the five stages are the real `/orch` path described in `content/docs/workflow.mdx`.

Concepts considered:
1. Prompt to PR (chosen). Fit 5, originality 4, feasibility 5, portability 2.
2. A tmux pane grid where each guide is a pane. Fit 4, originality 3, portability 3 (any terminal
   fan could use it).
3. A keyboard map where keys open guides. Fit 3 (only one guide is about keys), feasibility 3.

Genericness check: a generic model lands on a hero with a code card beside it (that was the
previous version). Changed: the command is a full-width bar under the type, not a card; the
workflow is a sticky stage section, not feature cards; guides are an index, not a grid.

## System

- Palette: ground and ink follow the fumadocs light and dark tokens. Stage section ground
  `#101110`, ink `#f1efea`, muted `#a3a6a2`, dimmed steps `#80837f` (4.9:1; steps dim by color,
  never by opacity, so they keep contrast). While the section is under the sticky header, the
  header takes the same night tokens. Accent dot `#ff5a36`; accent text `--color-brand`
  (5:1 on light ground, light orange on dark).
- Type: Pretendard Variable for everything; mono = system mono with Pretendard for Hangul.
  Mega `clamp(3.2rem, 1rem + 8.6vw, 9rem)`, tracking -0.045em, leading 0.98. Stage word
  `clamp(3rem, 1rem + 7vw, 8rem)`. Body 17px, leading 1.6.
- Grid: one column of max 72rem with a 12-column split in the hero bar and the stage section
  (5 / 7). Section rhythm: tall hero, taller stage section, compact index.
- Shape: radius 0 except the pill CTA (full).
- Motion: one ease `cubic-bezier(0.16, 1, 0.3, 1)`. Hero lines rise 0.9s staggered 70ms, by
  transform only, so the text is painted on the first frame. Stage
  word swaps by a short upward step (240ms). Cursor blinks at 1.1s. All of it is off under
  reduced motion; content is fully visible without it.
- Hover: the pill CTA floods with the accent; nav links and the logo draw an accent underline
  from the left; guide rows shift and turn accent. No primary target changes color alone.
- Idle: the cursor blink is the idle state. The stage section is still at rest by decision.

## Sections

```
HERO     name / role                         guides 6 · posts 42
         MEGA LINE ONE
         MEGA LINE TWO.
         ───────────────────────────────────────────────
         > /orch prompt …█                      [see the workflow →]
         ───────────────────────────────────────────────
         bio (lede)                              GitHub ↗  Resume  All guides →

STAGES   (dark, sticky left)
         ● rail   GIANT WORD     | 01 code line
                                 |    body
                                 | 02 …

INDEX    Guides ────────────────────────────── 6
         01  Title                      →
```

Phone (390px): hero mega wraps to three or four lines; the prompt bar stacks the pill under the
command; the stage section drops the sticky column and shows each stage word above its step.
