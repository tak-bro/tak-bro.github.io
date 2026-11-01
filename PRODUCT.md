# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally (confirmed 2026-11-01):

- **Developers who work with coding agents.** They want to see how someone else sets up and runs Claude Code, opencode
  and pi, and borrow what fits.
- **People arriving from the resume or LinkedIn.** They want to know who this person is and how he works. The site does
  not pitch to recruiters; it shows the work.

## Product Purpose

A personal site of setup guides for coding-agent harnesses, written by the person who uses them every day. Success on
the home: a visitor leaves **remembering the person** — who he is and what he builds — and goes on to the resume or
GitHub (confirmed 2026-11-01). The guides are where the detail lives.

## Positioning

The guides describe one working setup, not a survey: the author's own rules, hooks, skills and subagents, the plan →
slice → PR → knowledge loop they drive, and the incidents that shaped them. Facts are checked against the author's own
config repositories, so nothing is general advice dressed up as experience.

## Operating Context

- Subject: Tak (Hyungtak Jin, 진형탁). Web, React Native and Electron since 2018; now works through Claude Code,
  opencode and pi with his own rules, hooks and skills.
- Guides (8 pairs, ko and en): introduction, principles, agent config, workflow, knowledge loop, plugins and MCP,
  Herdr, keymaps.
- Visitors arrive from the resume (PDF in the nav), LinkedIn, GitHub and search.

## Capabilities and Constraints

- Static site: React Router 7 prerendered, fumadocs for the docs, Tailwind 4, deployed to GitHub Pages.
- Korean is the default language and English mirrors it with the same structure. Korean copy speaks in 해요체
  (formal statements in 습니다체); `pnpm check` enforces it on the guides.
- No motion library (no GSAP, no Lenis). Under `prefers-reduced-motion` every motion is off.
- Colour and type stay on the fumadocs tokens and Pretendard, shared with the guides; the home does not become a
  separate visual island.
- No employer or company names (a sensitive-content gate blocks them). The config repositories stay private: no links
  to them.
- No blog or project pages; they were removed on purpose.

## Brand Commitments

- Name shown as "Tak(진형탁)" / "Tak (Hyungtak Jin)".
- Voice: plain, first person, specific. Korean in 해요체.

## Evidence on Hand

- The guides themselves and their SVG diagrams (`app/components/diagrams/`), including the setup map and the knowledge
  loop.
- A herdr screen recording (used in the Herdr guide).
- Public resume PDF (`public/assets/resume.pdf`), GitHub profile `tak-bro`, LinkedIn.
- Absent, never to be invented: customers, testimonials, employer names, usage metrics, star counts, adoption numbers.
  Counts from the knowledge base (plans, notes) are not used: their definitions are not stable.

## Product Principles

1. Show the person through the work: the setup and how it runs, not adjectives about him.
2. Every claim has a source in the author's own config; when it has none, it goes.
3. The home is short; the depth is one click away in a guide.
4. Korean first, English equal in structure.
