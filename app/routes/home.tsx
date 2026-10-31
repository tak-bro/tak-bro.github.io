import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import {
  baseOptions,
  GITHUB_URL,
  HOME_CONTENT_ID,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
  requestPath,
  source,
  type HomeCheckId,
  type HomeCopy,
  type HomeGuide,
  type HomeGuideGroup,
  type HomeStage,
} from '../lib';

export const meta = ({ location }: Route.MetaArgs) => {
  const copy = homeCopy(localeFromPath(location.pathname));

  return [
    { title: copy.documentTitle },
    { name: 'description', content: copy.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: copy.documentTitle },
    { property: 'og:description', content: copy.description },
  ];
};

const REPO_URL = `${GITHUB_URL}/tak-bro.github.io`;

// Rows only for guides that exist; check:links fails on a row to an unwritten one.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));
  const pages = homeCopy(lang).guides.flatMap((guide) => {
    const page = source.getPage([guide.slug], lang);
    return page ? [{ slug: guide.slug, page }] : [];
  });
  const outlines = await Promise.all(
    pages.map(async ({ slug, page }) => {
      const { lastModified, toc } = await page.data.load();
      const outline: GuideOutline = {
        updated: lastModified ? lastModified.toISOString().slice(0, 10) : null,
        description: page.data.description,
        headings: toc.flatMap((item) => (item.depth === 2 ? [textOf(item.title)] : [])),
      };
      return [slug, outline] as const;
    }),
  );

  return {
    lang,
    publishedGuides: pages.map(({ slug }) => slug),
    outlines: Object.fromEntries(outlines),
  };
};

/** What the guide preview shows: the page's own description and its section headings. */
interface GuideOutline {
  readonly updated: string | null;
  readonly description: string;
  readonly headings: readonly string[];
}

/** A TOC title is rendered MDX; the preview needs its plain text. */
const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
};

type Rgba = readonly [number, number, number, number];
type Verdict = { readonly pass: boolean; readonly evidence: string };

/** Paints any CSS colour (oklch included) to a pixel and reads it back as sRGB. */
const toRgba = (color: string): Rgba => {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!context) return [0, 0, 0, 0];
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a];
};

const luminance = ([r, g, b]: Rgba) => {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};

const hex = ([r, g, b]: Rgba) => `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

/** The first opaque background behind an element: the ground its text is read on. */
const groundOf = (element: Element): Rgba => {
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = toRgba(getComputedStyle(node).backgroundColor);
    if (background[3] === 255) return background;
  }
  return [255, 255, 255, 255];
};

/** Each criterion measured on the live page, so the verdict follows the theme and the viewport. */
const measure = (copy: HomeCopy, published: readonly string[]): Record<HomeCheckId, Verdict> => {
  const h1 = document.querySelector('h1');
  const lines = h1 ? Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)) : 0;

  const lede = document.querySelector('[data-check="lede"]');
  const ink = lede ? toRgba(getComputedStyle(lede).color) : groundOf(document.body);
  const ground = lede ? groundOf(lede) : groundOf(document.body);
  const [light = 0, dark = 0] = [luminance(ink), luminance(ground)].sort((a, b) => b - a);
  const ratio = (light + 0.05) / (dark + 0.05);

  const guideLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[data-guide]')];
  const resolved = guideLinks.filter((link) => published.includes(link.dataset.guide ?? ''));

  const navLinks = [...new Set([...document.querySelectorAll('#nd-nav a')].map((link) => link.textContent?.trim()).filter(Boolean))];

  return {
    headline: { pass: lines > 0 && lines <= 2, evidence: `h1 → ${copy.lineCount(lines)}` },
    contrast: { pass: ratio >= 4.5, evidence: `${hex(ink)} / ${hex(ground)} → ${ratio.toFixed(1)}:1` },
    guides: {
      pass: guideLinks.length > 0 && resolved.length === guideLinks.length,
      evidence: `${resolved.length}/${guideLinks.length} ${copy.pagesExist}`,
    },
    nav: { pass: navLinks.length <= 3, evidence: navLinks.join(' · ') },
  };
};

/** The hero's working fragment: this page's own acceptance contract, measured when asked. */
const Checks = ({ copy, published }: { copy: HomeCopy; published: readonly string[] }) => {
  const [verdicts, setVerdicts] = useState<Record<HomeCheckId, Verdict> | null>(null);
  const [runs, setRuns] = useState(0);
  const run = () => {
    setVerdicts(measure(copy, published));
    setRuns((count) => count + 1);
  };

  useEffect(() => {
    let live = true;
    void document.fonts.ready.then(() => {
      if (live) setVerdicts(measure(copy, published));
    });
    return () => {
      live = false;
    };
  }, [copy, published]);

  return (
    <div data-ui className="w-full max-w-[32rem] rounded-md bg-fd-background text-fd-foreground">
      <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-2">
        <p className="text-[15px] font-semibold">{copy.checksTitle}</p>
        <button
          type="button"
          className="home-press rounded-sm bg-fd-secondary px-3 py-1.5 text-sm font-medium hover:bg-fd-accent"
          onClick={run}
        >
          {copy.checksRun}
        </button>
      </div>
      <ol className="flex flex-col px-5 pb-4" aria-live="polite">
        {copy.checks.map((check, index) => {
          const verdict = verdicts?.[check.id];
          const status = verdict ? (verdict.pass ? 'PASS' : 'FAIL') : copy.checksPending;
          return (
            <li
              key={`${check.id}-${runs}`}
              className="home-rise grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-2.5"
              style={{ '--i': index } as React.CSSProperties}
            >
              <span className="text-[15px] leading-snug">{check.claim}</span>
              <span
                className={`text-sm font-semibold tabular-nums ${verdict?.pass === false ? 'text-red-700 dark:text-red-300' : verdict ? '' : 'text-fd-muted-foreground'}`}
              >
                {status}
              </span>
              <code className="col-span-2 font-mono text-[13px] text-fd-muted-foreground break-all">{verdict ? verdict.evidence : '—'}</code>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/** A terminal-sized fragment of a session. Hook output (indented or bracketed) reads as an error. */
const Session = ({ lines, className = '' }: { lines: readonly string[]; className?: string }) => (
  <pre className={`overflow-x-auto rounded-md bg-fd-background p-5 text-[13px] leading-relaxed whitespace-pre-wrap ${className}`}>
    <code className="font-mono">
      {lines.map((line, index) => (
        <span key={index} className={`block ${line.startsWith('[') || line.startsWith('  ') ? 'text-red-700 dark:text-red-300' : ''}`}>
          {line}
        </span>
      ))}
    </code>
  </pre>
);

/**
 * The /orch path: the statement nearest the middle of the viewport is the active one,
 * and the pinned session beside it crossfades to that stage.
 */
const Stages = ({ heading, stages }: { heading: string; stages: readonly HomeStage[] }) => {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(steps.current.findIndex((step) => step === entry.target));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const step of steps.current) if (step) observer.observe(step);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="stages-heading" className="home-frame grid gap-x-16 pt-32 lg:grid-cols-2">
      <div className="flex flex-col">
        <h2 id="stages-heading" className="home-reveal text-2xl font-semibold tracking-tight">
          {heading}
        </h2>
        <ol className="flex flex-col">
          {stages.map((stage, index) => (
            <li
              key={stage.statement}
              ref={(node) => {
                steps.current[index] = node;
              }}
              data-active={index === active}
              className="home-step flex flex-col justify-center gap-3 py-10 lg:min-h-[42vh]"
            >
              <p className="text-2xl font-semibold tracking-tight break-keep">{stage.statement}</p>
              <p className="max-w-md text-[17px] leading-relaxed break-keep">{stage.body}</p>
              <Session lines={stage.session} className="mt-3 bg-fd-card lg:hidden" />
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden lg:block" aria-hidden>
        <div data-ui className="sticky top-[calc(50vh-12rem)] grid min-h-[24rem] content-center rounded-md bg-fd-card p-6">
          {stages.map((stage, index) => (
            <Session
              key={stage.statement}
              lines={stage.session}
              className={`home-state min-h-[20rem] !text-[15px] [grid-area:1/1] ${index === active ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * The guide index: rows on the left, and beside them the page a row opens, shown as the docs
 * show it (description and section headings) for the row last pointed at or focused.
 */
const Guides = ({
  heading,
  groups,
  docsHref,
  outlines,
}: {
  heading: string;
  groups: readonly (HomeGuideGroup & { guides: readonly HomeGuide[] })[];
  docsHref: string;
  outlines: Record<string, GuideOutline>;
}) => {
  const first = groups[0]?.guides[0];
  const [shown, setShown] = useState(first?.slug ?? '');
  const guide = groups.flatMap((group) => group.guides).find((item) => item.slug === shown) ?? first;
  const outline = guide ? outlines[guide.slug] : undefined;

  return (
    <section id="guides" aria-labelledby="guides-heading" className="home-frame grid scroll-mt-20 gap-x-16 gap-y-10 pt-32 lg:grid-cols-2">
      <div className="flex flex-col gap-10">
        <h2 id="guides-heading" className="home-reveal text-2xl font-semibold tracking-tight">
          {heading}
        </h2>
        {groups.map((group) => (
          <div key={group.id} className="home-reveal flex flex-col gap-2">
            <h3 className="text-[15px] text-fd-muted-foreground">{group.heading}</h3>
            <ul className="flex flex-col">
              {group.guides.map((item) => {
                const updated = outlines[item.slug]?.updated;
                return (
                  <li key={item.slug}>
                    <Link
                      data-guide={item.slug}
                      data-shown={item.slug === guide?.slug}
                      to={`${docsHref}/${item.slug}`}
                      onPointerEnter={() => setShown(item.slug)}
                      onFocus={() => setShown(item.slug)}
                      className="group -mx-3 grid grid-cols-[1fr_auto] items-baseline gap-x-6 rounded-md px-3 py-3 transition-colors hover:bg-fd-card lg:data-[shown=true]:bg-fd-card"
                    >
                      <span className="flex items-baseline gap-2.5">
                        <span
                          className="size-2 shrink-0 -translate-y-px rounded-full bg-fd-muted-foreground/60 transition-colors group-hover:bg-brand"
                          aria-hidden
                        />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-[17px] font-semibold">{item.title}</span>
                          <span className="text-[15px] text-fd-muted-foreground break-keep">{item.blurb}</span>
                        </span>
                      </span>
                      {updated ? (
                        <time dateTime={updated} className="text-sm tabular-nums text-fd-muted-foreground">
                          {updated}
                        </time>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {guide && outline ? (
        <div className="hidden lg:block" aria-hidden>
          <div data-ui key={guide.slug} className="home-swap sticky top-24 flex flex-col gap-5 rounded-md bg-fd-card p-8">
            <p className="text-sm text-fd-muted-foreground">
              {docsHref}/{guide.slug}
            </p>
            <p className="text-2xl font-semibold tracking-tight">{guide.title}</p>
            <p className="text-[15px] leading-relaxed text-fd-muted-foreground break-keep">{outline.description}</p>
            <ul className="flex flex-col gap-2 rounded-md bg-fd-background p-5 text-[15px]">
              {outline.headings.map((title) => (
                <li key={title} className="break-keep">
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
};

/** Elements below the fold rise in once as they enter; anything already on screen is left alone. */
const useReveal = () => {
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const pending = [...document.querySelectorAll<HTMLElement>('.home-reveal')].filter(
      (element) => element.getBoundingClientRect().top > window.innerHeight,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.reveal = 'in';
          observer.unobserve(element);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    for (const element of pending) {
      element.dataset.reveal = 'pending';
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const copy = homeCopy(loaderData.lang);
  const docsHref = localizedDocsHref(loaderData.lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));
  const groups = copy.guideGroups
    .map((group) => ({ ...group, guides: guides.filter((guide) => guide.group === group.id) }))
    .filter((group) => group.guides.length > 0);
  useReveal();

  return (
    <HomeLayout {...baseOptions({ lang: loaderData.lang })}>
      <section id={HOME_CONTENT_ID} className="grid lg:min-h-[66svh] lg:grid-cols-2">
        <div className="home-frame order-2 flex flex-col justify-end gap-6 py-14 lg:order-1 lg:pr-12 lg:pb-16">
          <h1 className="home-rise max-w-[18ch] text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] font-semibold tracking-tight break-keep">
            {copy.headline}
          </h1>
          <p data-check="lede" className="home-rise max-w-[44ch] text-[17px] leading-relaxed break-keep [--i:1]">
            {copy.lede}
          </p>
          <div className="home-rise flex flex-wrap items-center gap-x-6 gap-y-3 [--i:2]">
            <Link
              to={`${docsHref}/principles`}
              className="home-press inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-[15px] font-semibold text-fd-background hover:bg-fd-foreground hover:text-fd-background"
            >
              {copy.primaryCta}
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
            <a href="#guides" className="home-link text-[15px] font-medium">
              <span>{copy.allGuides}</span>
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
          </div>
        </div>
        <div className="home-frame order-1 flex items-end justify-center bg-fd-card py-12 lg:order-2 lg:pb-16">
          <Checks copy={copy} published={loaderData.publishedGuides} />
        </div>
      </section>

      <section aria-labelledby="intro-heading" className="home-frame grid gap-x-16 gap-y-10 pt-32 lg:grid-cols-2">
        <div className="flex max-w-[34rem] flex-col gap-5">
          <h2 id="intro-heading" className="home-reveal text-2xl font-semibold tracking-tight break-keep">
            {copy.introHeading}
          </h2>
          {copy.intro.map((paragraph, index) => (
            <p key={paragraph} className={`home-reveal text-[17px] leading-relaxed break-keep ${index === 0 ? 'font-semibold' : ''}`}>
              {paragraph}
            </p>
          ))}
          <Link to={`${docsHref}/principles`} className="home-reveal home-link self-start text-[15px] font-medium">
            <span>{copy.introLink}</span>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
        <figure className="home-reveal flex flex-col gap-3 self-end">
          <div data-ui className="rounded-md bg-fd-card p-6">
            <Session lines={copy.hookSession} className="min-h-[12rem]" />
          </div>
          <figcaption className="text-[15px] text-fd-muted-foreground break-keep">{copy.hookCaption}</figcaption>
        </figure>
      </section>

      <Stages heading={copy.stagesHeading} stages={copy.stages} />

      {groups.length > 0 ? (
        <Guides heading={copy.guidesHeading} groups={groups} docsHref={docsHref} outlines={loaderData.outlines} />
      ) : null}

      <section aria-labelledby="about-heading" className="home-frame grid gap-x-16 gap-y-12 pt-32 lg:grid-cols-[10rem_1fr]">
        <h2 id="about-heading" className="home-reveal text-2xl font-semibold tracking-tight lg:col-span-2">
          {copy.aboutHeading}
        </h2>
        <dl className="home-reveal grid grid-cols-3 gap-4 text-[15px] lg:grid-cols-1 lg:content-start">
          {copy.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col">
              <dt className="text-fd-muted-foreground">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-14">
          <p className="home-reveal max-w-[40ch] text-[19px] leading-snug tracking-tight break-keep sm:text-2xl">{copy.bio}</p>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
            {copy.recordGroups.map((group) => (
              <div key={group.word} className="home-reveal flex flex-col gap-1 text-[15px]">
                <h3 className="pb-1 text-fd-muted-foreground">{group.word}</h3>
                {group.records.map((record) => {
                  const className = '-mx-2 flex items-baseline justify-between gap-4 rounded-sm px-2 py-1.5 transition-colors hover:bg-fd-card';
                  const value = <span className="text-fd-muted-foreground">{record.value}</span>;
                  if (record.guide) {
                    return (
                      <Link key={record.name} to={`${docsHref}/${record.href}`} className={className}>
                        <span>{record.name}</span>
                        {value}
                      </Link>
                    );
                  }
                  const external = record.href.startsWith('http');
                  return (
                    <a
                      key={record.name}
                      href={record.href}
                      className={className}
                      {...(external ? { rel: 'noreferrer noopener', target: '_blank' } : {})}
                    >
                      <span className="inline-flex items-center gap-1">
                        {record.name}
                        {external ? (
                          <>
                            <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                            <span className="sr-only">{copy.newTabLabel}</span>
                          </>
                        ) : null}
                      </span>
                      {value}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="home-frame grid gap-2 pt-[20svh] pb-8 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-6">
        <span className="text-fd-muted-foreground">{copy.footerWhat}</span>
        <span className="flex flex-wrap gap-x-6 gap-y-1">
          <a href={`${REPO_URL}/blob/main/LICENSE`} className="inline-block py-1 underline-offset-4 hover:underline">
            {copy.codeLicense}
          </a>
          <a href={`${REPO_URL}/blob/main/LICENSE-CONTENT`} className="inline-block py-1 underline-offset-4 hover:underline">
            {copy.contentLicense}
          </a>
        </span>
        <span className="text-fd-muted-foreground sm:text-right">© 2026 tak-bro</span>
      </footer>
    </HomeLayout>
  );
};

export default Home;
