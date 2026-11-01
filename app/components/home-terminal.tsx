import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { HomeCopy } from '../lib/home-copy';
import { GITHUB_URL, LINKEDIN_URL } from '../lib/shared';
import { SITE_URL } from '../lib/site';

/**
 * The home's terminal: `env | grep tak`, then `claude`, then the request that rebuilt this site and the
 * session's own lines. It plays once when it scrolls into view: commands type character by character,
 * output prints after its command, and a spinner runs while the agent works.
 *
 * Every line is in the prerendered HTML, so the page reads without JS. Lines that have not played yet
 * are `visibility: hidden`, so nothing moves when they appear. Under reduced motion it never plays.
 */

type Beat = { kind: 'type'; text: string } | { kind: 'show'; wait: number };

/** pending: prerendered, CSS shows everything after a delay if JS never runs · armed: waiting to scroll in. */
type Play = 'pending' | 'armed' | 'playing' | 'done';

const TYPE_MS = 30;
const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
const ENV_CMD_TEXT = 'env | grep tak';
const CLAUDE_CMD_TEXT = 'claude';

const linkClass = 'underline decoration-fd-border underline-offset-4 [overflow-wrap:anywhere] hover:decoration-current';

/** `grep tak` colours each match in its output. */
const Grep = ({ text }: { text: string }) => (
  <>
    {text.split(/(tak)/).map((part, index) =>
      part === 'tak' ? (
        <mark key={index} className="bg-transparent text-brand">
          {part}
        </mark>
      ) : (
        part
      ),
    )}
  </>
);

const Shell = () => (
  <span className="text-brand" aria-hidden>
    tak ~ ${' '}
  </span>
);

const Caret = ({ rest }: { rest?: boolean }) => <span className={rest ? 'home-term-caret home-term-caret-rest' : 'home-term-caret'} aria-hidden />;

const ExternalLink = ({ href, text }: { href: string; text: string }) => (
  <a href={href} rel="noreferrer noopener" target="_blank" className={linkClass}>
    <Grep text={text} />
  </a>
);

const envLines = (resumeHref: string) => [
  { name: 'NAME', node: <Grep text="Hyungtak Jin" /> },
  { name: 'GITHUB', node: <ExternalLink href={GITHUB_URL} text="tak-bro" /> },
  { name: 'LINKED_IN', node: <ExternalLink href={LINKEDIN_URL} text={LINKEDIN_URL.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')} /> },
  { name: 'RESUME', node: <ExternalLink href={resumeHref} text={`${new URL(SITE_URL).host}${resumeHref}`} /> },
];

/** The script, one beat per command or printed line, and where each part of the panel sits in it. */
const buildScript = (copy: HomeCopy, envCount: number) => {
  const beats: Beat[] = [];
  const add = (beat: Beat) => beats.push(beat) - 1;
  const envCmd = add({ kind: 'type', text: ENV_CMD_TEXT });
  const env = Array.from({ length: envCount }, () => add({ kind: 'show', wait: 70 }));
  const claudeCmd = add({ kind: 'type', text: CLAUDE_CMD_TEXT });
  const header = add({ kind: 'show', wait: 300 });
  const request = add({ kind: 'type', text: copy.request });
  const session = copy.session.map((line) => ({
    head: add({ kind: 'show', wait: 520 }),
    result: line.kind === 'tool' ? add({ kind: 'show', wait: 260 }) : -1,
  }));
  const input = add({ kind: 'show', wait: 200 });
  return { beats, envCmd, env, claudeCmd, header, request, session, input };
};

export interface HomeTerminalProps {
  readonly copy: HomeCopy;
  readonly docsHref: string;
  readonly resumeHref: string;
}

export const HomeTerminal = ({ copy, docsHref, resumeHref }: HomeTerminalProps) => {
  const env = envLines(resumeHref);
  const script = useMemo(() => buildScript(copy, env.length), [copy, env.length]);
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
      { threshold: 0.35 },
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
      delay = pos.chars === 0 ? 300 : TYPE_MS + ((pos.chars * 37) % 5) * 8;
      next = { at: pos.at, chars: pos.chars + 1 };
    } else {
      delay = beat.kind === 'type' ? 280 : beat.wait;
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
  /** A `type` beat's line shows while it types; a `show` beat's line shows once its wait is over. */
  const shown = (index: number) => pos.at > index || (play === 'playing' && pos.at === index && beats[index].kind === 'type');
  const step = (index: number) => ({ 'data-step': '', ...(playing && shown(index) ? { 'data-on': '' } : {}) });

  /** A command as typed so far, the caret at its end, the rest kept invisible so the line never reflows. */
  const typed = (index: number): ReactNode => {
    const beat = beats[index];
    const text = beat.kind === 'type' ? beat.text : '';
    if (!playing || pos.at > index) return text;
    const chars = Array.from(text);
    const count = pos.at === index ? pos.chars : 0;
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
    working && pos.at === index ? (
      <span className="home-term-spin absolute inset-x-0 top-0 text-brand" aria-hidden>
        {SPINNER[frame]} Orchestrating…
      </span>
    ) : null;

  const guideTitle = (slug: string) => copy.guides.find((guide) => guide.slug === slug)?.title;

  return (
    <div
      ref={ref}
      data-play={play}
      aria-busy={play === 'playing'}
      className="home-term rounded-md border border-fd-border bg-fd-card px-4 py-5 font-mono text-[12.5px] leading-[1.8] sm:px-7 sm:py-6 sm:text-[13.5px]"
    >
      <p {...step(script.envCmd)}>
        <Shell />
        {typed(script.envCmd)}
      </p>
      {env.map((entry, index) => (
        <p key={entry.name} {...step(script.env[index])}>
          {entry.name}={entry.node}
        </p>
      ))}

      <p className="mt-4" {...step(script.claudeCmd)}>
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
                  <span className={tool ? 'font-semibold' : undefined}>{line.kind === 'tool' ? line.call : line.text}</span>
                </span>
                <Link
                  to={`${docsHref}/${line.guide}`}
                  className="font-sans text-[12px] whitespace-nowrap text-fd-muted-foreground group-hover/log:text-brand hover:text-brand max-sm:hidden motion-safe:transition-colors sm:text-[13px]"
                >
                  {guideTitle(line.guide)} →
                </Link>
              </p>
              {tool ? (
                <p className={`relative flex gap-2 pl-5 break-keep ${tool.blocked ? 'text-fd-error' : 'text-fd-muted-foreground'}`} {...step(result)}>
                  {spinner(result)}
                  <span aria-hidden>⎿</span>
                  <span>{tool.result}</span>
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
