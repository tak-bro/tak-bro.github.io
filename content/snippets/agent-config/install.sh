#!/usr/bin/env bash
#
# install.sh — wire this repo into the machine. Safe to re-run.
#
#   claude/<item>     → ~/.claude/<item>         one symlink per tracked top-level item
#   agent-skills/*    → ~/.agents/skills/<name>  (pi/install.sh)
#   pi/home/*         → ~/.pi/agent/*            (pi/install.sh)
#   opencode/*        → ~/.config/opencode/*     (opencode/install.sh — only when that directory exists)
#   external-skills.txt → ~/.agents/skills/<skill> via `npx skills add -g`, linked as claude/skills/<skill>
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
# AGENT_CONFIG_EXTERNAL_SKILLS=0 skips external-skills.txt (install.test.sh sets it: no network in tests).
# AGENT_CONFIG_EXTERNAL_LIST / AGENT_CONFIG_EXTERNAL_LINKS point it at another list and link directory (tests).
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

# `npx skills add -g` links claude/skills/<skill> relative to ~/.claude/skills, which resolves inside
# this checkout and dangles — so the link is always rewritten as an absolute one.
link_external_skills(){
  local list="${AGENT_CONFIG_EXTERNAL_LIST:-$ROOT/external-skills.txt}" links="${AGENT_CONFIG_EXTERNAL_LINKS:-$SRC/skills}"
  local store="$HOME/.agents/skills" cmds="$DST/commands" src skill dst f cmd out rc=0 n=0
  [ "${AGENT_CONFIG_EXTERNAL_SKILLS:-1}" = 0 ] && return 0
  [ -f "$list" ] || return 0
  while read -r src skill _ <&3; do
    case "$src" in ''|'#'*) continue ;; esac
    dst="$links/$skill"
    # checked before npx: `skills add -g` deletes a real directory of the same name
    if [ -e "$dst" ] && [ ! -L "$dst" ]; then
      log "WARN: claude/skills/$skill is a real directory — left alone; remove it to link $store/$skill"; continue
    fi
    if [ ! -f "$store/$skill/SKILL.md" ]; then
      log "install external skill: $skill ($src)"
      if ! command -v npx >/dev/null 2>&1; then
        log "WARN: npx not found — external skill $skill skipped"; rc=1; continue
      fi
      if ! $DRY && ! out="$(npx -y skills add "$src" -g -s "$skill" -y </dev/null 2>&1)"; then
        log "WARN: npx skills add $src -s $skill failed:"; printf '%s\n' "$out" | tail -n 5; rc=1; continue
      fi
    fi
    if [ "$(readlink "$dst" 2>/dev/null)" != "$store/$skill" ]; then
      log "link: claude/skills/$skill → $store/$skill"
      $DRY || ln -sfn "$store/$skill" "$dst" || { log "ERROR: could not link $skill"; rc=1; }
    fi
    for f in "$store/$skill"/commands/*.md; do
      [ -f "$f" ] || continue
      cmd="$cmds/${f##*/}"
      [ "$(readlink "$cmd" 2>/dev/null)" = "$f" ] && continue
      if [ -e "$cmd" ] && ! [ -L "$cmd" ] && ! cmp -s "$f" "$cmd"; then
        log "WARN: ~/.claude/commands/${f##*/} differs from $f — left alone"; continue
      fi
      log "link: ~/.claude/commands/${f##*/}"
      $DRY || { mkdir -p "$cmds" && ln -sfn "$f" "$cmd"; } || { log "ERROR: could not link ${f##*/}"; rc=1; }
    done
    n=$((n+1))
  done 3< "$list"
  log "external skills: $n ready"
  return $rc
}

# Hard requirements, checked before anything is linked. deny-dangerous.sh fails closed without
# jq (every Bash call is blocked), the python hooks (commit-convention, worktree-guard/-rescue,
# completion-gate, compact-gate) cannot start without python3, and the links come from git ls-files.
require_tools(){
  local t missing=""
  for t in git jq python3; do
    command -v "$t" >/dev/null 2>&1 || missing="$missing $t"
  done
  [ -z "$missing" ] && return 0
  log "ERROR: required tool(s) missing:$missing — the Bash guard blocks every command without jq and the python hooks cannot run. Install them, then re-run."
  return 1
}

# Read-only. Nothing here is required to link; each missing tool only turns off
# the hooks or skills that call it.
check_tools(){
  local t
  command -v node >/dev/null 2>&1 || log "WARN: node not found — tool-output-trim passes tool results through untouched"
  command -v bun >/dev/null 2>&1 || log "WARN: bun not found (optional) — the team-lead mod hooks do nothing; see README § Tools"
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

require_tools || exit 1
link_claude || exit 1
if $PI; then
  if $DRY; then bash "$ROOT/pi/install.sh" --dry-run; else bash "$ROOT/pi/install.sh"; fi || exit 1
  # opencode half: skips itself when ~/.config/opencode is absent
  if $DRY; then bash "$ROOT/opencode/install.sh" --dry-run; else bash "$ROOT/opencode/install.sh"; fi || exit 1
fi
link_external_skills || log "WARN: some external skills were not installed — re-run once the cause is fixed"
check_tools
$DRY || verify || exit 1
log "done$($DRY && echo ' (dry run — nothing changed)')"
