#!/bin/sh
# Reports each agent pane's git branch as its `branch` metadata token, which
# the sidebar agent rows in config.toml show as `$branch`.
#
# herdr runs this from a `tab_bar_right` command entry purely as a timer: it
# prints nothing, so the entry itself stays invisible. The token carries a TTL,
# so it disappears on its own if this stops running.
#
# The type prefix is dropped (feat/herdr-sidebar -> herdr-sidebar) and
# the default branches config.toml fades (main, master, develop) report nothing:
# the spaces panel already shows the full branch.

PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
herdr=${HERDR_BIN_PATH:-herdr}
tab=$(printf '\t')

"$herdr" pane list |
  jq -r '.result.panes[] | select(.agent != null) | [.pane_id, .foreground_cwd // .cwd] | @tsv' |
  while IFS=$tab read -r pane cwd; do
    branch=$(git -C "$cwd" symbolic-ref --quiet --short HEAD 2>/dev/null)
    case $branch in
      main | master | develop) branch= ;;
    esac
    # An empty value clears the token.
    "$herdr" pane report-metadata "$pane" --source custom:pane-branch \
      --token "branch=${branch#*/}" --ttl-ms 30000 >/dev/null
  done
