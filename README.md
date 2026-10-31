# tak-bro.github.io

Source of [tak-bro.github.io](https://tak-bro.github.io): building coding-agent harnesses, and working with them. Notes on the blog, the harness-side projects, and guides to my coding-agent principles, agent config, workflow, plugins and MCP servers, Herdr, and keymaps. Korean is the default language; the home and guides also live in English under `/en`, while posts and projects are Korean only.

Built with [fumadocs](https://fumadocs.dev) on React Router 7 as a fully prerendered static site.

The home page has its own design (concept, palette, type scale, motion) recorded in [DESIGN.md](DESIGN.md); docs, blog and projects use the fumadocs layout. What the site is for, who reads it and what a redesign must keep are in [SITE-BRIEF.md](SITE-BRIEF.md).

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

It runs, in order: sensitive pattern scan, typecheck, tests, production build, internal link check, and required files check. The last line it prints is `check: ok`. CI runs the same command on every pull request.

- **Required files.** `/assets/resume.pdf`, `/assets/resume_eng.pdf`, `404.html`, and `index.html` must be in the build. The resume URLs are linked from outside the site.
- **Sensitive patterns.** `content/`, `public/`, and `app/` must not contain a work email or account, a local home path, or a credential. Binary files are skipped. Exceptions go in `config/sensitive-allow.json`.

## Content

- Docs pages live in `content/docs/`. Each page has a Korean file `x.mdx` and an English file `x.en.mdx`, and each `meta.json` has a `meta.en.json`. A test fails if either side is missing.
- Blog posts (`content/blog/`) and projects (`content/projects/`) are Korean only. They are served at `/blog/<slug>` and `/projects/<name>`, with no English page, no hreflang, and no language switcher. Neither is in the nav, and `/blog` lists only posts dated 2026 or later (`LISTED_SINCE` in `app/lib/blog-list.ts`); older posts keep their URLs. They are generated from the old Jekyll repo, so do not edit them by hand. To regenerate them, run `node scripts/import-jekyll.mjs <jekyll repo>`. It also replaces `public/assets/img/blog/` and `public/assets/img/projects/` with the referenced images, and masks keys and local paths. If any output still matches a sensitive pattern, nothing is written.
- Config snippets in `content/snippets/` are copied from my private repos by `just sync-configs`. Only the files listed in `config/sync-allowlist.json` are copied. If any file matches a sensitive pattern, nothing is written. Docs show a snippet only through `<include>../snippets/<repo>/<path></include>`, and a test fails if an include points anywhere but an allowlisted snippet.

## License

Code is licensed under [MIT](LICENSE). Written content is licensed under [CC BY 4.0](LICENSE-CONTENT).
