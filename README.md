# tak-bro.github.io

Source of [tak-bro.github.io](https://tak-bro.github.io): setup guides for coding-agent harnesses — my principles, agent config, workflow, knowledge loop, plugins and MCP servers, and Herdr and keymaps. Korean is the default language; the home and guides also live in English under `/en`.

Built with [fumadocs](https://fumadocs.dev) on React Router 7 as a fully prerendered static site.

The home page has its own design (concept, palette, type scale, motion) recorded in [DESIGN.md](DESIGN.md); the docs use the fumadocs layout. What the site is for, who reads it and what a redesign must keep are in [SITE-BRIEF.md](SITE-BRIEF.md).

## Develop

Requires Node 22+ and pnpm 10.

```sh
pnpm install
cp .env.example .env
pnpm dev            # http://localhost:5175
```

## Check

```sh
pnpm check
```

It runs, in order: sensitive pattern scan, guide check, typecheck, tests, production build, internal link check, and required files check. The last line it prints is `check: ok`. CI runs the same command on every pull request.

- **Required files.** `/assets/resume.pdf`, `/assets/resume_eng.pdf`, `404.html`, and `index.html` must be in the build. The resume URLs are linked from outside the site.
- **Guides.** `scripts/check-guides.mjs` reads every Korean guide in `content/docs` (prose, and the `label`/`alt` text of JSX tags) and fails on a sentence, heading, list item or table cell that ends in the plain `-다` form; the site speaks 해요체. It also requires the Korean and English page of each guide to draw the same number of diagrams (components named `…Diagram`), at least one except on the introduction. `node scripts/check-guides.mjs <slug> --min N` checks one guide.
- **Sensitive patterns.** `content/`, `public/`, and `app/` must not contain a work email or account, a local home path, or a credential. Binary files are skipped. Exceptions go in `config/sensitive-allow.json`.

## Content

- Docs pages live in `content/docs/`. Each page has a Korean file `x.mdx` and an English file `x.en.mdx`, and each `meta.json` has a `meta.en.json`. A test fails if either side is missing.
- Config snippets in `content/snippets/` are copied from my private repos by `just sync-configs`. Only the files listed in `config/sync-allowlist.json` are copied. If any file matches a sensitive pattern, nothing is written. Docs show a snippet only through `<include>../snippets/<repo>/<path></include>`, and a test fails if an include points anywhere but an allowlisted snippet.

## License

Code is licensed under [MIT](LICENSE). Written content is licensed under [CC BY 4.0](LICENSE-CONTENT).
