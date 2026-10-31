# Review verify-fix loop

When `03-review` finds issues, this loop runs on its own — no fresh instruction from the user. **The stop conditions'
canonical home is § Exit + § Stops outside the loop below** — other files only point at these two sections.

## Loop

1. Review done → Fix Checklist (the Review Output in `SKILL.md`).
2. Any [Critical] or [Important] → straight to `04-fix` with the Fix Checklist.
   - Exception — **Axis-B Important (scope-creep)**: not a code fix. A user gate — revert, or record acceptance in the
     plan's `## Decisions`.

### Loop 3 — Re-verify
- **Deterministic checks first** (the repo's verification commands) — failing → back to fix without a re-review (a new
  fix round — § Loop 4).
- Passing → **reuse the same finder** (`SKILL.md` § After findings **Fail**: re-send with `- mode: re-review` +
  `- delta:`). Earlier verdicts and finding lists are not sent again. Fallback (no agent id, an error, a harness that
  cannot re-address a subagent) = a fresh spawn + an Outcome observation row.
- **Same-issue recurrence** is judged by the main session comparing Fix Checklists across iterations.

### Loop 4 — Iterations and the counter
**Max 3 iterations — independently per slice.** One iteration = one fix round + that round's re-review — the third fix
gets its re-review too. The count lives in the plan's `## Outcome` as one line `- fix-loop: <slice> iteration N/3`,
**updated in place** (survives compaction). On exit this row stays (`compound` reads it) and only the review row is
updated to the final Review Output form.

**The counter is read and raised only where a fix round opens — in every mode.** Three places open one: an
implementation verify-red retry · entering `04-fix` · respawning a re-review that died without a return (a dead round
counts once too). There, read N first: `N` ≥ 3 → **neither fix nor spawn**, go to Exit "3 exhausted"; otherwise rewrite
the row to `iteration N+1/3` (open it when absent) and start the round. A normal re-review neither reads nor raises the
counter — it belongs to the round just opened. With a plan:

```bash
S=$(printf '%s' "$SLICE" | sed 's/[][\.*^$+?(){}|]/\\&/g')   # escape metacharacters of merged ids such as `04+05`
N=$(grep -E "fix-loop: (slice )?${S}([^0-9]|$)" "$PLAN" | grep -oiE 'iteration +[0-9]+' \
    | grep -oE '[0-9]+' | sort -n | tail -1)
echo "fix-loop N=${N:-0}"
```

A standalone `- plan: none` call counts in the Output report, within the same turn only.

## Exit

| Condition | Action |
|------|------|
| [Critical] 0 + [Important] 0 (Nice-to-have only left included) | Slice passes → queue rows left: **advance to the next frontier automatically** (`02-implement`); drained: the loop ends — the finish is the user's call (in autonomous mode, continue to the chain's finish in the same turn) |
| Axis-B Important (scope-creep) left | Stop the auto-loop → **user gate** (revert, or accept in `## Decisions`). Re-review after it is resolved. In autonomous mode, do not stop — record it as accepted |
| The same issue recurs twice in a row | Stop now — change approach, or report |
| 3 exhausted (review FAIL and verify red counted together) | Stop + report — every remaining issue and every fix tried. The user decides |

Autonomous mode (a chain `orch` drives — with a plan, its header `Orch:` line): the exceptions' canonical home is
`../orch/SKILL.md` (its autonomous-mode rules).

## Stops outside the loop

The Exit table stops on review results. Below are the places this session cannot judge, whatever the review said — it
neither stops nor asks outside these two sections. Autonomous mode stops here too (except where a row says otherwise).

| Place | Condition | Action |
|---|---|---|
| `02-implement` pre-implementation (plan lookup) | the session has no plan path and there is not exactly one unfinished plan candidate | ask the user |
| `02-implement` pre-implementation (tree check) | a tracked change outside the plan's Files table | stop and report — a change of unknown ownership does not ride a slice commit |
| `02-implement` frontier loop | the slice is blocked on permission outside the code (credentials, an external console, a human approval) | stop and report — a human marks `[b]` (below) |
| `SKILL.md` § Finder spawn 3 | the respawned finder's return is invalid too | stop and report |
| TDD seam confirmation | the plan has no `## Seams`, or there is no plan | confirm the seam once. Autonomous mode: no question, the recommended seam |
| language pack detection | ambiguous (ask) | one question. Autonomous mode: no question, `none` |

`[b]` is not an exit of the Exit table — it is an implementation-time boundary (permission outside the code), not a
review result. Escaping a FAIL through `[b]` is forbidden. A human-marked `[b]` row leaves the frontier and its criteria
are skipped as BLOCKED — nothing more.

Source: `claude/skills/_shared/review-loop.md`.
