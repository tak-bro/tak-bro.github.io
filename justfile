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

# Redraw public/og.png from scripts/og/og.html (needs agent-browser).
og:
    agent-browser --session og set viewport 1200 630
    agent-browser --session og open "file://{{justfile_directory()}}/scripts/og/og.html"
    agent-browser --session og wait 500
    agent-browser --session og screenshot "{{justfile_directory()}}/public/og.png"
