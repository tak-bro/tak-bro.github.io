import type { CSSProperties } from 'react';

/** A `[hook]` line and its indented continuation lines. */
const hookLines = (lines: readonly string[]) => {
  let inHook = false;
  return lines.map((line) => (inHook = line.startsWith('[') || (inHook && line.startsWith('  '))));
};

const WRAPPED = 'text-[12.5px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]';

/**
 * A fragment of real output. Each line carries its index so the lines print one after another when the
 * fragment enters (app.css `.home-line`, only where the home's reveal runs); hook output reads as an error.
 * Lines wrap on a phone and keep their columns from `sm` up, where a long line scrolls sideways, hence focusable.
 * Inside a link (a project card) it is `decorative`: always wrapped, not focusable, hidden from the link's name.
 */
export const Session = ({
  lines,
  labelledBy,
  decorative = false,
}: {
  lines: readonly string[];
  labelledBy?: string;
  decorative?: boolean;
}) => {
  const hook = hookLines(lines);
  return (
    <pre
      tabIndex={decorative ? undefined : 0}
      aria-labelledby={labelledBy}
      aria-hidden={decorative || undefined}
      className={
        decorative ? WRAPPED : `home-focus overflow-x-auto ${WRAPPED} sm:text-[13px] sm:whitespace-pre sm:[overflow-wrap:normal]`
      }
    >
      <code className="font-mono">
        {lines.map((line, index) => (
          <span
            key={index}
            style={{ '--l': index } as CSSProperties}
            className={`home-line block min-h-[1lh] ${hook[index] ? 'text-red-700 dark:text-red-300' : ''}`}
          >
            {line}
          </span>
        ))}
      </code>
    </pre>
  );
};
