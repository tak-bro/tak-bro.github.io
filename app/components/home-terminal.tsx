import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { HomeCopy } from '../lib/home-copy';

/**
 * The home's terminal: `claude`, then the request that rebuilt this site and the session's own lines.
 * It plays once when it scrolls into view, typed like the old env-tak page: commands type at a person's
 * pace, the agent's lines type out faster after them, and a spinner holds a line's slot until it starts.
 *
 * Every line is in the prerendered HTML, so the page reads without JS. Lines that have not played yet
 * are `visibility: hidden`, so nothing moves when they appear. Under reduced motion it never plays.
 */

/** `agent` lines stay hidden, the spinner in their slot, until their first character. */
type Beat = { kind: 'type'; text: string; lead: number; agent: boolean } | { kind: 'show'; wait: number };

/** pending: prerendered, CSS shows everything after a delay if JS never runs · armed: waiting to scroll in. */
type Play = 'pending' | 'armed' | 'playing' | 'done';

/** A person types one character at a time; the agent streams two. */
const TYPE_MS = 42;
const STREAM_MS = 22;
const STREAM_CHUNK = 2;
const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
const CLAUDE_CMD_TEXT = 'claude';

const Shell = () => (
  <span className="text-brand" aria-hidden>
    tak ~ ${' '}
  </span>
);

const Caret = ({ rest }: { rest?: boolean }) => <span className={rest ? 'home-term-caret home-term-caret-rest' : 'home-term-caret'} aria-hidden />;

/** The script, one beat per command or printed line, and where each part of the panel sits in it. */
const buildScript = (copy: HomeCopy) => {
  const beats: Beat[] = [];
  const add = (beat: Beat) => beats.push(beat) - 1;
  const claudeCmd = add({ kind: 'type', text: CLAUDE_CMD_TEXT, lead: 300, agent: false });
  const header = add({ kind: 'show', wait: 300 });
  const request = add({ kind: 'type', text: copy.request, lead: 300, agent: false });
  const session = copy.session.map((line) => ({
    head: add({ kind: 'type', text: line.kind === 'tool' ? line.call : line.text, lead: 420, agent: true }),
    result: line.kind === 'tool' ? add({ kind: 'type', text: line.result, lead: 160, agent: true }) : -1,
  }));
  const input = add({ kind: 'show', wait: 200 });
  return { beats, claudeCmd, header, request, session, input };
};

export interface HomeTerminalProps {
  readonly copy: HomeCopy;
  readonly docsHref: string;
}

export const HomeTerminal = ({ copy, docsHref }: HomeTerminalProps) => {
  const script = useMemo(() => buildScript(copy), [copy]);
  const { beats } = script;

  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState<Play>('pending');
  const [pos, setPos] = useState({ at: 0, chars: 0 });
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setPlay('done');
      return;
    }
    setPlay('armed');
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setPlay('playing');
      },
      // A line, not a ratio: a panel taller than a zoomed-in viewport never reaches a ratio, and would stay hidden.
      { rootMargin: '0px 0px -25% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (play !== 'playing') return;
    const beat = beats[pos.at];
    if (!beat) {
      setPlay('done');
      return;
    }
    let delay: number;
    let next: typeof pos;
    if (beat.kind === 'type' && pos.chars < Array.from(beat.text).length) {
      if (pos.chars === 0) delay = beat.lead;
      else delay = beat.agent ? STREAM_MS : TYPE_MS + ((pos.chars * 37) % 5) * 8;
      next = { at: pos.at, chars: pos.chars + (beat.agent ? STREAM_CHUNK : 1) };
    } else {
      if (beat.kind === 'show') delay = beat.wait;
      else delay = beat.agent ? 120 : 280;
      next = { at: pos.at + 1, chars: 0 };
    }
    const timer = window.setTimeout(() => setPos(next), delay);
    return () => window.clearTimeout(timer);
  }, [play, pos, beats]);

  const working = play === 'playing' && pos.at > script.request && pos.at < script.input;
  useEffect(() => {
    if (!working) return;
    const timer = window.setInterval(() => setFrame((value) => (value + 1) % SPINNER.length), 110);
    return () => window.clearInterval(timer);
  }, [working]);

  const playing = play === 'playing' || play === 'armed';
  /** A line shows once its beat is over, or while it types: a person's prompt at once, an agent's line from its first character. */
  const typing = (index: number) => {
    const beat = beats[index];
    return play === 'playing' && pos.at === index && beat.kind === 'type' && (!beat.agent || pos.chars > 0);
  };
  const stepOn = (on: boolean) => ({ 'data-step': '', ...(playing && on ? { 'data-on': '' } : {}) });
  const step = (index: number) => stepOn(pos.at > index || typing(index));

  /** A command as typed so far, the caret at its end, the rest kept invisible so the line never reflows. */
  const typed = (index: number): ReactNode => {
    const beat = beats[index];
    const text = beat.kind === 'type' ? beat.text : '';
    if (!playing || pos.at > index) return text;
    const chars = Array.from(text);
    const count = pos.at === index ? Math.min(pos.chars, chars.length) : 0;
    return (
      <>
        {chars.slice(0, count).join('')}
        {pos.at === index ? <Caret /> : null}
        <span className="invisible">{chars.slice(count).join('')}</span>
      </>
    );
  };

  /** While the agent works, the spinner holds the slot of the line it is about to print. */
  const spinner = (index: number) =>
    working && pos.at === index && !typing(index) ? (
      <span className="home-term-spin absolute inset-x-0 top-0 text-brand" aria-hidden>
        {SPINNER[frame]} Orchestrating…
      </span>
    ) : null;

  return (
    <div
      ref={ref}
      data-play={play}
      aria-busy={play === 'playing'}
      className="home-term rounded-md border border-fd-border bg-fd-card px-4 py-5 font-mono text-[12.5px] leading-[1.8] sm:px-7 sm:py-6 sm:text-[13.5px]"
    >
      <p {...step(script.claudeCmd)}>
        <Shell />
        {typed(script.claudeCmd)}
      </p>
      <div className="mt-2 w-fit max-w-full rounded-md border border-brand/60 px-3 py-1.5 font-mono leading-[1.6]" {...step(script.header)}>
        <p>
          <span className="text-brand" aria-hidden>
            ✻{' '}
          </span>
          <span className="font-semibold">Claude Code</span>
        </p>
        <p className="text-fd-muted-foreground">~/workspace/tak-bro/tak-bro.github.io</p>
      </div>

      <p className="home-term-user mt-4 flex gap-2 rounded-sm px-2 py-1 break-keep" {...step(script.request)}>
        <span className="text-fd-muted-foreground" aria-hidden>
          &gt;
        </span>
        <span>{typed(script.request)}</span>
      </p>

      <ol className="mt-3 flex flex-col gap-1.5">
        {copy.session.map((line, index) => {
          const { head, result } = script.session[index];
          const tool = line.kind === 'tool' ? line : null;
          return (
            <li key={index} className="group/log">
              <p className="relative items-baseline gap-x-6 break-keep sm:grid sm:grid-cols-[1fr_auto]" {...step(head)}>
                {spinner(head)}
                <span className="flex gap-2">
                  <span className={tool?.blocked ? 'text-fd-error' : 'text-fd-foreground'} aria-hidden>
                    ⏺
                  </span>
                  <span className={tool ? 'font-semibold' : undefined}>{typed(head)}</span>
                </span>
                <Link
                  {...stepOn(pos.at > head)}
                  to={`${docsHref}/${line.guide}`}
                  className="font-sans text-[12px] whitespace-nowrap text-fd-muted-foreground group-hover/log:text-brand hover:text-brand max-sm:hidden motion-safe:transition-colors sm:text-[13px]"
                >
                  {copy.guideTitles[line.guide]} →
                </Link>
              </p>
              {tool ? (
                <p className={`relative flex gap-2 pl-5 break-keep ${tool.blocked ? 'text-fd-error' : 'text-fd-muted-foreground'}`} {...step(result)}>
                  {spinner(result)}
                  <span aria-hidden>⎿</span>
                  <span>{typed(result)}</span>
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-3 flex gap-2 rounded-sm border border-fd-border px-2 py-1" {...step(script.input)}>
        <span className="text-fd-muted-foreground" aria-hidden>
          &gt;
        </span>
        <Caret rest />
      </p>
    </div>
  );
};
