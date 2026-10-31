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
  type HomeCopy,
  type HomeGuide,
  type HomeGuideGroup,
  type HomeLayer,
  type HomePhone,
  type HomeScene,
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

/** A `[hook]` line and its indented continuation lines. */
const hookLines = (lines: readonly string[]) =>
  lines.reduce<boolean[]>((flags, line) => [...flags, line.startsWith('[') || (flags.at(-1) === true && line.startsWith('  '))], []);

/** A terminal-sized fragment of a session; hook output reads as an error. */
const Session = ({ lines, className = '' }: { lines: readonly string[]; className?: string }) => {
  const hook = hookLines(lines);
  return (
    <pre className={`overflow-x-auto rounded-md bg-fd-background p-5 text-[13px] leading-relaxed whitespace-pre-wrap ${className}`}>
      <code className="font-mono">
        {lines.map((line, index) => (
          <span key={index} className={`block ${hook[index] ? 'text-red-700 dark:text-red-300' : ''}`}>
            {line}
          </span>
        ))}
      </code>
    </pre>
  );
};

/** The enforcement ladder, strongest layer first; the picked layer shows its real example. */
const Layers = ({ copy }: { copy: HomeCopy }) => {
  const [picked, setPicked] = useState(0);
  const layer: HomeLayer | undefined = copy.layers[picked];

  return (
    <section aria-labelledby="layers-heading" className="home-frame grid gap-x-16 gap-y-10 pt-32 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <h2 id="layers-heading" className="home-reveal text-2xl font-semibold tracking-tight break-keep">
          {copy.layersHeading}
        </h2>
        <p className="home-reveal max-w-[40ch] text-[17px] leading-relaxed break-keep">{copy.layersIntro}</p>
        <div className="home-reveal flex flex-col gap-1">
          <p className="text-sm text-fd-muted-foreground">↑ {copy.layersStrong}</p>
          <ol className="flex flex-col">
            {copy.layers.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={index === picked}
                  onClick={() => setPicked(index)}
                  onPointerEnter={() => setPicked(index)}
                  onFocus={() => setPicked(index)}
                  className="group -mx-3 grid w-[calc(100%+1.5rem)] grid-cols-[3.5rem_1fr] items-baseline gap-x-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-fd-card aria-pressed:bg-fd-card"
                >
                  <span
                    className="h-2 -translate-y-px justify-self-end rounded-full bg-fd-muted-foreground/60 transition-colors group-aria-pressed:bg-brand"
                    style={{ width: `${(copy.layers.length - index) * 0.5 + 0.5}rem` }}
                    aria-hidden
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[17px] font-semibold">{item.name}</span>
                    <span className="text-[15px] text-fd-muted-foreground break-keep">{item.body}</span>
                  </span>
                </button>
                {index === picked ? <Session lines={item.example} className="mt-2 mb-3 bg-fd-card lg:hidden" /> : null}
              </li>
            ))}
          </ol>
          <p className="text-sm text-fd-muted-foreground">↓ {copy.layersWeak}</p>
        </div>
      </div>
      {layer ? (
        <div className="hidden lg:block" aria-hidden>
          <div data-ui key={layer.name} className="home-swap sticky top-24 flex min-h-[24rem] flex-col gap-4 rounded-md bg-fd-card p-6">
            <p className="text-sm text-fd-muted-foreground">
              {layer.name} · {layer.source}
            </p>
            <Session lines={layer.example} className="!text-[15px]" />
          </div>
        </div>
      ) : null}
    </section>
  );
};

/** A push as the hwip app shows it: the session it came from, the question and its buttons. */
const Phone = ({ phone }: { phone: HomePhone }) => (
  <div className="mx-auto flex w-full max-w-[18rem] flex-col rounded-[2rem] bg-fd-foreground p-3">
    <div className="flex min-h-[26rem] flex-col gap-3 rounded-[1.5rem] bg-fd-background p-4 pt-10">
      <div className="flex flex-col gap-3 rounded-xl bg-fd-card p-4">
        <p className="text-[13px] text-fd-muted-foreground">hwip · {phone.app}</p>
        <p className="text-[15px] leading-snug font-semibold break-keep">{phone.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {phone.actions.map((action, index) => (
            <span
              key={action}
              className={`rounded-md px-2 py-2 text-center text-[13px] font-semibold ${index === 0 ? 'bg-brand text-fd-background' : 'bg-fd-secondary'}`}
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SceneFragment = ({ scene, className = '' }: { scene: HomeScene; className?: string }) =>
  scene.phone ? <Phone phone={scene.phone} /> : <Session lines={scene.session} className={className} />;

/** A working day; the scene nearest the viewport's middle drives the pinned fragment. */
const Scenes = ({ heading, scenes }: { heading: string; scenes: readonly HomeScene[] }) => {
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
    <section aria-labelledby="scenes-heading" className="home-frame grid gap-x-16 pt-32 lg:grid-cols-2">
      <div className="flex flex-col">
        <h2 id="scenes-heading" className="home-reveal text-2xl font-semibold tracking-tight">
          {heading}
        </h2>
        <ol className="flex flex-col">
          {scenes.map((scene, index) => (
            <li
              key={scene.statement}
              ref={(node) => {
                steps.current[index] = node;
              }}
              data-active={index === active}
              className="home-step flex flex-col justify-center gap-3 py-10 lg:min-h-[42vh]"
            >
              <p className="text-2xl font-semibold tracking-tight break-keep">{scene.statement}</p>
              <p className="max-w-md text-[17px] leading-relaxed break-keep">{scene.body}</p>
              <div className="mt-3 lg:hidden">
                <SceneFragment scene={scene} className="bg-fd-card" />
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden lg:block" aria-hidden>
        <div data-ui className="sticky top-[calc(50vh-12rem)] grid min-h-[24rem] content-center rounded-md bg-fd-card p-6">
          {scenes.map((scene, index) => (
            <div key={scene.statement} className={`home-state grid content-center [grid-area:1/1] ${index === active ? 'opacity-100' : 'opacity-0'}`}>
              <SceneFragment scene={scene} className="min-h-[20rem] !text-[15px]" />
            </div>
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
        <div className="home-frame flex flex-col justify-end gap-6 py-14 lg:pr-12 lg:pb-16">
          <h1 className="home-rise max-w-[18ch] text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] font-semibold tracking-tight break-keep">
            {copy.headline}
          </h1>
          <p className="home-rise max-w-[44ch] text-[17px] leading-relaxed break-keep [--i:1]">{copy.lede}</p>
          <ul className="home-rise flex flex-wrap gap-2 [--i:2]">
            {copy.tools.map((tool) => (
              <li key={tool.name} className="rounded-sm bg-fd-card px-2.5 py-1 text-sm">
                <span className="font-semibold">{tool.name}</span> <span className="text-fd-muted-foreground">{tool.role}</span>
              </li>
            ))}
          </ul>
          <div className="home-rise flex flex-wrap items-center gap-x-6 gap-y-3 [--i:3]">
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
        <div className="home-frame flex items-end justify-center bg-fd-card py-12 lg:pb-16">
          <figure className="flex w-full max-w-[34rem] flex-col gap-3">
            <div data-ui className="rounded-md bg-fd-background">
              <Session lines={copy.heroSession} className="min-h-[13rem]" />
            </div>
            <figcaption className="text-[15px] text-fd-muted-foreground break-keep">{copy.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      <Layers copy={copy} />

      <Scenes heading={copy.scenesHeading} scenes={copy.scenes} />

      <section aria-labelledby="principles-heading" className="home-frame flex flex-col gap-10 pt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="principles-heading" className="home-reveal text-2xl font-semibold tracking-tight break-keep">
            {copy.principlesHeading}
          </h2>
          <Link to={`${docsHref}/principles`} className="home-reveal home-link text-[15px] font-medium">
            <span>{copy.principlesLink}</span>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.principles.map((principle) => (
            <li key={principle.title} className="home-reveal flex flex-col gap-3 rounded-md bg-fd-card p-6">
              <p className="text-[19px] font-semibold tracking-tight break-keep">{principle.title}</p>
              <p className="text-base leading-relaxed break-keep">{principle.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="try-heading" className="home-frame grid gap-x-16 gap-y-8 pt-32 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 id="try-heading" className="home-reveal text-2xl font-semibold tracking-tight break-keep">
            {copy.tryHeading}
          </h2>
          <p className="home-reveal text-[17px] leading-relaxed break-keep">{copy.tryIntro}</p>
        </div>
        <ol className="flex flex-col gap-6">
          {copy.trySteps.map((step, index) => (
            <li key={step} className="home-reveal grid grid-cols-[2.5rem_1fr] items-baseline">
              <span className="text-2xl font-semibold tabular-nums text-brand">{index + 1}</span>
              <span className="text-[19px] leading-snug tracking-tight break-keep">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {groups.length > 0 ? (
        <Guides heading={copy.guidesHeading} groups={groups} docsHref={docsHref} outlines={loaderData.outlines} />
      ) : null}

      <div className="mt-32 bg-fd-card">
      <section aria-labelledby="about-heading" className="home-frame grid gap-x-16 gap-y-12 pt-24 lg:grid-cols-[10rem_1fr]">
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
                  const className = '-mx-2 flex items-baseline justify-between gap-4 rounded-sm px-2 py-1.5 transition-colors hover:bg-fd-background';
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

      <footer className="home-frame grid gap-2 pt-24 pb-8 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-6">
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
      </div>
    </HomeLayout>
  );
};

export default Home;
