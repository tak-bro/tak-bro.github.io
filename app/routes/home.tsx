import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { HerdrDemo, primaryButton } from '../components';
import {
  baseOptions,
  GITHUB_URL,
  CONTENT_ID,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
  requestPath,
  source,
  type HomeCopy,
  type HomePhone,
  type HomeWork,
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

// Cards only for guides that exist; check:links fails on a card to an unwritten one.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));
  const pages = homeCopy(lang).guides.flatMap((guide) => {
    const page = source.getPage([guide.slug], lang);
    return page ? [{ slug: guide.slug, page }] : [];
  });
  const updated = await Promise.all(
    pages.map(async ({ slug, page }) => {
      const { lastModified } = await page.data.load();
      return [slug, lastModified ? lastModified.toISOString().slice(0, 10) : null] as const;
    }),
  );

  return {
    lang,
    publishedGuides: pages.map(({ slug }) => slug),
    updated: Object.fromEntries(updated) as Record<string, string | null>,
  };
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

/** A push as the hwip app shows it on a lock screen. */
const Phone = ({ phone }: { phone: HomePhone }) => (
  <div className="mx-auto w-full max-w-[15rem] rounded-t-[1.75rem] bg-fd-foreground px-2.5 pt-2.5">
    <div className="flex min-h-[11rem] flex-col justify-end rounded-t-[1.25rem] bg-fd-background p-3">
      <div className="flex flex-col gap-2.5 rounded-xl bg-fd-card p-3">
        <p className="text-[12px] text-fd-muted-foreground">hwip · {phone.app}</p>
        <p className="text-[14px] leading-snug font-semibold break-keep">{phone.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {phone.actions.map((action, index) => (
            <span
              key={action}
              className={`rounded-md px-2 py-1.5 text-center text-[12px] font-semibold ${index === 0 ? 'bg-brand text-fd-background' : 'bg-fd-secondary'}`}
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SectionHead = ({ id, heading, children }: { id: string; heading: string; children?: ReactNode }) => (
  <div className="home-reveal flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
    <h2 id={id} className="text-2xl font-semibold tracking-tight break-keep">
      {heading}
    </h2>
    {children}
  </div>
);

const WorkCard = ({ work }: { work: HomeWork }) => (
  <li data-ui className="home-reveal flex flex-col justify-between gap-5 overflow-hidden rounded-md bg-fd-card p-5 pb-0">
    <div className="flex flex-col gap-1">
      <code className="font-mono text-[15px] font-semibold">{work.name}</code>
      <p className="text-[17px] leading-snug break-keep">{work.line}</p>
    </div>
    {work.phone ? <Phone phone={work.phone} /> : <Session lines={work.session} className="mb-5 min-h-[11rem]" />}
  </li>
);

/** The enforcement ladder, strongest layer first; the picked layer shows its real example. */
const Layers = ({ copy, docsHref }: { copy: HomeCopy; docsHref: string }) => {
  const [picked, setPicked] = useState(0);
  const layer = copy.layers[picked];

  return (
    <section aria-labelledby="layers-heading" className="home-frame flex flex-col gap-8 pt-32">
      <SectionHead id="layers-heading" heading={copy.layersHeading}>
        <Link to={`${docsHref}/principles`} className="home-link text-[15px] font-medium">
          <span>{copy.principlesLink}</span>
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
        </Link>
      </SectionHead>
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
        <div className="home-reveal flex flex-col gap-2">
          <p className="text-[15px] text-fd-muted-foreground">{copy.layersLede}</p>
          <ol className="flex flex-col">
            {copy.layers.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={index === picked}
                  onClick={() => setPicked(index)}
                  onPointerEnter={() => setPicked(index)}
                  onFocus={() => setPicked(index)}
                  className="group grid w-full grid-cols-[3.5rem_7rem_1fr] items-baseline gap-x-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-fd-card aria-pressed:bg-fd-card"
                >
                  <span
                    className="h-2 -translate-y-px justify-self-end rounded-full bg-fd-muted-foreground/60 transition-colors group-aria-pressed:bg-brand"
                    style={{ width: `${(copy.layers.length - index) * 0.5 + 0.5}rem` }}
                    aria-hidden
                  />
                  <span className="text-[17px] font-semibold">{item.name}</span>
                  <span className="text-[15px] text-fd-muted-foreground break-keep">{item.body}</span>
                </button>
                {index === picked ? <Session lines={item.example} className="mt-2 mb-3 bg-fd-card lg:hidden" /> : null}
              </li>
            ))}
          </ol>
        </div>
        {layer ? (
          <div className="hidden lg:block" aria-hidden>
            <div data-ui key={layer.name} className="home-swap flex h-full min-h-[22rem] flex-col gap-3 rounded-md bg-fd-card p-6">
              <p className="text-sm text-fd-muted-foreground">{layer.source}</p>
              <Session lines={layer.example} className="!text-[15px]" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const ExternalMark = ({ label }: { label: string }) => (
  <>
    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
    <span className="sr-only">{label}</span>
  </>
);

const isExternal = (href: string) => href.startsWith('http');

const external = (link: { href: string }) => (isExternal(link.href) ? { rel: 'noreferrer noopener', target: '_blank' } : {});

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
  useReveal();

  return (
    <HomeLayout {...baseOptions({ lang: loaderData.lang })}>
      <section id={CONTENT_ID} className="grid lg:min-h-[66svh] lg:grid-cols-2">
        <div className="home-frame flex flex-col justify-end gap-6 py-14 lg:pr-12 lg:pb-16">
          <h1 className="home-rise max-w-[18ch] text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-semibold tracking-tight break-keep">
            {copy.headline}
          </h1>
          <p className="home-rise max-w-[40ch] text-[17px] leading-relaxed break-keep [--i:1]">{copy.lede}</p>
          <ul className="home-rise flex flex-wrap gap-2 [--i:2]">
            {copy.tools.map((tool) => (
              <li key={tool.name} className="rounded-sm bg-fd-card px-2.5 py-1 text-sm">
                <span className="font-semibold">{tool.name}</span> <span className="text-fd-muted-foreground">{tool.role}</span>
              </li>
            ))}
          </ul>
          <div className="home-rise flex flex-wrap items-center gap-x-6 gap-y-3 [--i:3]">
            <a
              href="#guides"
              className={primaryButton}
            >
              {copy.primaryCta}
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </a>
            <a href={GITHUB_URL} rel="noreferrer noopener" target="_blank" className="home-link text-[15px] font-medium">
              <span>GitHub</span>
              <ExternalMark label={copy.newTabLabel} />
            </a>
          </div>
        </div>
        <div className="home-frame flex items-end justify-center bg-fd-card py-12 lg:pb-16">
          <figure className="flex w-full max-w-[34rem] flex-col gap-3">
            <div data-ui className="rounded-md bg-fd-background">
              <Session lines={copy.heroSession} className="min-h-[13rem]" />
            </div>
            <figcaption className="text-[15px] text-fd-muted-foreground">{copy.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="work-heading" className="home-frame flex flex-col gap-8 pt-32">
        <SectionHead id="work-heading" heading={copy.workHeading} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.work.map((work) => (
            <WorkCard key={work.name} work={work} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="demo-heading" className="home-frame flex flex-col gap-8 pt-32">
        <SectionHead id="demo-heading" heading={copy.demo.heading}>
          <Link to={`${docsHref}/herdr`} className="home-link text-[15px] font-medium">
            <span>{copy.demo.guideLink}</span>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </SectionHead>
        <p className="home-reveal -mt-4 max-w-[60ch] text-[17px] leading-relaxed break-keep">{copy.demo.line}</p>
        <div data-ui className="home-reveal">
          <HerdrDemo label={copy.demo.label} />
        </div>
      </section>

      <Layers copy={copy} docsHref={docsHref} />

      {guides.length > 0 ? (
        <section id="guides" aria-labelledby="guides-heading" className="home-frame flex scroll-mt-20 flex-col gap-8 pt-32">
          <SectionHead id="guides-heading" heading={copy.guidesHeading} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => {
              const updated = loaderData.updated[guide.slug];
              return (
                <li key={guide.slug} className="home-reveal">
                  <Link
                    to={`${docsHref}/${guide.slug}`}
                    className="group flex h-full min-h-[9rem] flex-col justify-between gap-6 rounded-md bg-fd-card p-5 transition-colors hover:bg-fd-accent"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="flex items-center justify-between gap-2 text-[19px] font-semibold tracking-tight">
                        {guide.title}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="text-[15px] text-fd-muted-foreground break-keep">{guide.blurb}</span>
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
        </section>
      ) : null}

      <footer className="home-frame mt-32 flex flex-col gap-10 bg-fd-card pt-14 pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-[15px]">
          <p>{copy.about}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {copy.links.map((link) => (
              <li key={link.name}>
                <a href={link.href} {...external(link)} className="home-link font-medium">
                  <span>{link.name}</span>
                  {isExternal(link.href) ? <ExternalMark label={copy.newTabLabel} /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm text-fd-muted-foreground">
          <span className="flex flex-wrap gap-x-6 gap-y-1">
            <a href={`${REPO_URL}/blob/main/LICENSE`} className="inline-block py-1 underline-offset-4 hover:underline">
              {copy.codeLicense}
            </a>
            <a href={`${REPO_URL}/blob/main/LICENSE-CONTENT`} className="inline-block py-1 underline-offset-4 hover:underline">
              {copy.contentLicense}
            </a>
          </span>
          <span className="py-1">© 2026 tak-bro</span>
        </div>
      </footer>
    </HomeLayout>
  );
};

export default Home;
