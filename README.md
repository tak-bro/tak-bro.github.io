# tak-bro.github.io

Source of [tak-bro.github.io](https://tak-bro.github.io): guides to my coding-agent setup, workflow, Herdr, and keymaps. Korean is the default language; English lives under `/en`.

Built with [fumadocs](https://fumadocs.dev) on React Router 7 as a fully prerendered static site.

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

It runs, in order: typecheck, tests, production build, internal link check, required files check, and sensitive pattern scan. The last line it prints is `check: ok`. CI runs the same command on every pull request.

- **Required files.** `/assets/resume.pdf`, `/assets/resume_eng.pdf`, `404.html`, and `index.html` must be in the build. The resume URLs are linked from outside the site.
- **Sensitive patterns.** `content/`, `public/`, and `app/` must not contain a work email or account, a local home path, or a credential. Binary files are skipped. Exceptions go in `config/sensitive-allow.json`.

## Content

- Docs pages live in `content/docs/`. Each page has a Korean file `x.mdx` and an English file `x.en.mdx`, and each `meta.json` has a `meta.en.json`. A test fails if either side is missing.
- Config snippets in `content/snippets/` are copied from my private repos by `just sync-configs`. Only the files listed in `config/sync-allowlist.json` are copied. If any file matches a sensitive pattern, nothing is written.

## License

Code is licensed under [MIT](LICENSE). Written content is licensed under [CC BY 4.0](LICENSE-CONTENT).
