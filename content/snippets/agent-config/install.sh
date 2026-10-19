#!/usr/bin/env bash
#
# install.sh — wire this repo into the machine. Safe to re-run.
#
#   claude/<item>     → ~/.claude/<item>         one symlink per tracked top-level item
#   agent-skills/*    → ~/.agents/skills/<name>  (pi/install.sh)
#   pi/home/*         → ~/.pi/agent/*            (pi/install.sh)
#   opencode/*        → ~/.config/opencode/*     (opencode/install.sh — only when that directory exists)
#
# Why per item: ~/.claude also holds machine state Claude Code writes itself
# (projects/, sessions/, .credentials.json). Linking the whole directory would
# put that state inside the repo.
#
# Not linked: settings.json, settings.local.json, config.json, .mcp.json.
# Claude Code rewrites these in place, so each is copied once when missing and
# is yours from then on. hooks/settings-sync.py reports drift from the repo copy.
#
# Link policy for ~/.claude:
#   correct link          left alone
#   broken link           replaced (a moved checkout breaks every old link)
#   anything else there   moved to <item>.bak-<timestamp>, then linked
#
# ~/.claude/plugins is never touched: it is Claude Code's own state and is not in this repo.
#
# Usage:
#   bash install.sh                 # apply
#   bash install.sh --dry-run       # print what would change, change nothing
#   bash install.sh --claude-only   # skip the pi and opencode harnesses
#
set -uo pipefail
log(){ echo "[agent-config] $*"; }
usage(){ echo "usage: bash install.sh [--dry-run] [--claude-only]" >&2; exit 1; }

DRY=false PI=true
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=true ;;
    --claude-only) PI=false ;;
    *) usage ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$ROOT/claude"
DST="$HOME/.claude"
TS="$(date +%Y%m%d-%H%M%S)"
EXCLUDE="settings.json settings.local.json config.json .mcp.json"

# Tracked top-level items of claude/. Untracked runtime that lands in the
# checkout (.claude/, .codegraph/) must not be linked into ~/.claude.
claude_items(){
  git -C "$ROOT" ls-files -z -- claude 2>/dev/null | tr '\0' '\n' | cut -d/ -f2 | sort -u
}

link_claude(){
  local items item src dst linked=0 kept=0 seeded=0 rc=0
  items="$(claude_items)"
  [ -n "$items" ] || { log "ERROR: no tracked files under claude/ — this needs a git clone, not a ZIP download"; return 1; }
  $DRY || mkdir -p "$DST"
  while IFS= read -r item; do
    src="$SRC/$item"; dst="$DST/$item"
    case " $EXCLUDE " in
      *" $item "*)
        # a dead link counts as missing — otherwise the session starts with no settings at all
        if [ ! -e "$dst" ]; then
          log "copy (first run only): ~/.claude/$item"
          $DRY || { rm -f "$dst"; cp "$src" "$dst"; } || { log "ERROR: could not copy $item"; rc=1; }
          seeded=$((seeded+1))
        fi
        continue ;;
    esac
    if [ -L "$dst" ] && [ "$(readlink "$dst")" = "$src" ]; then
      kept=$((kept+1)); continue
    fi
    [ -e "$src" ] || { log "SKIP $item — tracked but missing from the checkout"; continue; }
    if [ -L "$dst" ] && [ ! -e "$dst" ]; then
      log "replace broken link: ~/.claude/$item (was $(readlink "$dst"))"
      $DRY || ln -sfn "$src" "$dst" || { log "ERROR: could not link $item"; rc=1; continue; }
    else
      if [ -L "$dst" ]; then
        log "backup: ~/.claude/$item → $item.bak-$TS (a link to $(readlink "$dst"))"
      elif [ -e "$dst" ]; then
        log "backup: ~/.claude/$item → $item.bak-$TS"
      fi
      if [ -e "$dst" ] && ! $DRY; then
        mv "$dst" "$dst.bak-$TS" || { log "ERROR: could not move $item aside"; rc=1; continue; }
      fi
      log "link: ~/.claude/$item"
      $DRY || ln -s "$src" "$dst" || { log "ERROR: could not link $item"; rc=1; continue; }
    fi
    linked=$((linked+1))
  done <<EOF
$items
EOF
  log "claude: linked $linked · already correct $kept · copied $seeded"
  return $rc
}

# Read-only. Nothing here is required to link; each missing tool only turns off
# the hooks or skills that call it.
check_tools(){
  local t
  for t in git jq python3 node; do
    command -v "$t" >/dev/null 2>&1 || log "WARN: $t not found — most hooks need it"
  done
  for t in gh rtk codegraph; do
    command -v "$t" >/dev/null 2>&1 || log "WARN: $t not found (optional) — see README § Tools"
  done
  [ -e "$DST/statusline.sh" ] || \
    log "WARN: ~/.claude/statusline.sh not found (optional) — settings.json statusLine calls it; see README § Tools"
}

verify(){
  local dst rc=0
  # RULES.md is imported by CLAUDE.md (`@RULES.md`); a missing link silently drops every shared rule
  for dst in "$DST/skills" "$DST/hooks" "$DST/CLAUDE.md" "$DST/RULES.md"; do
    if [ "$(readlink "$dst" 2>/dev/null)" != "$SRC/$(basename "$dst")" ]; then
      log "ERROR: $dst does not point into $SRC"; rc=1
    fi
  done
  if $PI && [ -d "$HOME/.config/opencode" ]; then
    # plugin + the core it imports + the hook scripts the seed document calls (list = opencode/install.sh § 1)
    local oc="$HOME/.config/opencode" rel
    for rel in plugins/cc-hooks.ts cc-hooks-core.ts; do
      if [ "$(readlink "$oc/$rel" 2>/dev/null)" != "$ROOT/opencode/$rel" ]; then
        log "ERROR: $oc/$rel does not point into $ROOT/opencode"; rc=1
      fi
    done
    for rel in deny-dangerous.sh dangerous-patterns.txt commit-convention.py rtk-guarded.sh tool-output-trim.js; do
      if [ "$(readlink "$oc/cc-hooks/$rel" 2>/dev/null)" != "$SRC/hooks/$rel" ]; then
        log "ERROR: $oc/cc-hooks/$rel does not point into $SRC/hooks"; rc=1
      fi
    done
  fi
  return $rc
}

link_claude || exit 1
if $PI; then
  if $DRY; then bash "$ROOT/pi/install.sh" --dry-run; else bash "$ROOT/pi/install.sh"; fi || exit 1
  # opencode half: skips itself when ~/.config/opencode is absent
  if $DRY; then bash "$ROOT/opencode/install.sh" --dry-run; else bash "$ROOT/opencode/install.sh"; fi || exit 1
fi
check_tools
$DRY || verify || exit 1
log "done$($DRY && echo ' (dry run — nothing changed)')"
