# Local entry points; `just --list` shows them.

# Start the dev server on localhost:5175.
dev:
    pnpm dev

# Copy allowlisted configs (config/sync-allowlist.json) into content/snippets/.
sync-configs:
    node scripts/sync-configs.mjs

# Scan published sources for sensitive patterns.
check-sensitive:
    node scripts/check-sensitive.mjs

# Run every gate CI runs: sensitive scan, typecheck, tests, build, links, required files.
check:
    pnpm check
