import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { primaryButton } from '../components';
import {
  baseOptions,
  GITHUB_URL,
  LINKEDIN_URL,
  CONTENT_ID,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
  requestPath,
  resumeHref,
  source,
  type HomeCopy,
  type HomeEvidence,
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
const PROFILE_LINKS = [
  { name: 'LinkedIn', href: LINKEDIN_URL },
  { name: 'GitHub', href: GITHUB_URL },
];
// The close asks for one thing: a hiring conversation, so GitHub stays in the hero and the footer.
const CONTACT_LINKS = PROFILE_LINKS.slice(0, 1);

// Rows only for guides that exist; check:links fails on a link to an unwritten one.
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

/**
 * A fragment of real output. Each line carries its index so the lines print one after another when the
 * fragment enters (app.css `.home-line`); hook output reads as an error. Lines wrap on a phone and keep
 * their columns from `sm` up, where a long line scrolls sideways, hence focusable.
 */
const Session = ({ lines }: { lines: readonly string[] }) => {
  const hook = hookLines(lines);
  return (
    <pre tabIndex={0} className="home-focus overflow-x-auto text-[12.5px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] sm:text-[13px] sm:whitespace-pre sm:[overflow-wrap:normal]">
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

/** Every section heading sits on the same left edge at the same size. */
const SectionHead = ({
  id,
  heading,
  lede,
  split = false,
  className = '',
}: {
  id: string;
  heading: string;
  lede?: string;
  /** Heading on the left, the line on the same baseline at the far right, so the row has no empty half. */
  split?: boolean;
  className?: string;
}) => (
  <div className={`home-reveal flex flex-col gap-3 ${split ? 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10' : ''} ${className}`}>
    <h2 id={id} className={`text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] font-semibold tracking-tight text-balance break-keep ${split ? 'lg:col-span-6' : ''}`}>
      {heading}
    </h2>
    {lede ? (
      <p className={`max-w-[48ch] text-[17px] leading-relaxed text-fd-muted-foreground break-keep ${split ? 'lg:col-span-6 lg:pb-1.5' : ''}`}>{lede}</p>
    ) : null}
  </div>
);

const ExternalMark = ({ label }: { label: string }) => (
  <>
    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
    <span className="sr-only">{label}</span>
  </>
);

const isExternal = (href: string) => href.startsWith('http');

const external = (link: { href: string }) => (isExternal(link.href) ? { rel: 'noreferrer noopener', target: '_blank' } : {});

/** The resume as the primary button, then profile links as text links. */
const Actions = ({
  copy,
  lang,
  links = PROFILE_LINKS,
  className = '',
}: {
  copy: HomeCopy;
  lang: string;
  links?: readonly { name: string; href: string }[];
  className?: string;
}) => (
  <div className={`flex flex-wrap items-center gap-x-7 gap-y-3 ${className}`}>
    <a href={resumeHref(lang)} rel="noreferrer noopener" target="_blank" className={`${primaryButton} min-h-11`}>
      {copy.primaryCta}
      <ExternalMark label={copy.newTabLabel} />
    </a>
    {links.map((link) => (
      <a key={link.name} href={link.href} rel="noreferrer noopener" target="_blank" className="home-link text-[15px] font-medium">
        <span>{link.name}</span>
        <ExternalMark label={copy.newTabLabel} />
      </a>
    ))}
  </div>
);

/** One answer to a hiring question: the claim on the left, the real output it rests on to the right. */
const Evidence = ({ item, docsHref }: { item: HomeEvidence; docsHref: string }) => (
  <li data-evidence className="home-reveal grid gap-6 lg:grid-cols-12 lg:gap-x-10">
    <div className="flex flex-col gap-4 lg:col-span-6 lg:pt-6">
      <p className="text-[17px] text-fd-muted-foreground break-keep">{item.question}</p>
      <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.2] font-semibold tracking-tight text-balance break-keep">{item.claim}</h3>
      <p className="max-w-[42ch] text-[17px] leading-relaxed text-pretty break-keep">{item.body}</p>
      <Link to={`${docsHref}/${item.guide}`} className="home-link mt-1 self-start text-[15px] font-medium">
        <span>{item.guideLabel}</span>
        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
      </Link>
    </div>
    <figure data-ui className="flex min-w-0 flex-col gap-4 rounded-md bg-fd-card p-4 sm:p-5 lg:col-span-6 lg:p-7">
      <figcaption className="text-sm text-fd-muted-foreground">{item.source}</figcaption>
      <Session lines={item.output} />
    </figure>
  </li>
);

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
      <section id={CONTENT_ID} aria-labelledby="hero-heading" className="home-frame flex flex-col gap-10 pt-12 pb-20 lg:gap-14 lg:pt-24 lg:pb-32">
        <h1 id="hero-heading" className="home-rise flex flex-col gap-5 break-keep">
          <span className="flex flex-wrap gap-x-3 text-[clamp(1.125rem,1.5vw,1.375rem)] font-semibold">
            <span>{copy.name}</span>
            <span className="text-fd-muted-foreground">{copy.role}</span>
          </span>
          <span className="max-w-[12em] text-[clamp(2rem,6.2vw,6rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
            {copy.headline}
          </span>
        </h1>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="flex flex-col gap-8 lg:col-span-6">
            <p className="home-rise max-w-[42ch] text-[clamp(1.0625rem,1.3vw,1.1875rem)] leading-relaxed text-pretty break-keep [--i:1]">
              {copy.lede}
            </p>
            <Actions copy={copy} lang={loaderData.lang} className="home-rise [--i:2]" />
          </div>
          <dl
            aria-label={copy.profileLabel}
            className="home-rise flex flex-col gap-4 self-start rounded-md bg-fd-card p-6 text-[15px] [--i:3] lg:col-span-6 lg:p-8"
          >
            {copy.profile.map((item) => (
              <div key={item.term} className="flex flex-col gap-0.5 sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-x-6">
                <dt className="text-fd-muted-foreground">{item.term}</dt>
                <dd className="break-keep">
                  {item.href ? (
                    <a href={item.href} {...external({ href: item.href })} className="home-link font-medium">
                      <span>{item.detail}</span>
                      <ExternalMark label={copy.newTabLabel} />
                    </a>
                  ) : (
                    item.detail
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="evidence-heading" className="home-frame flex flex-col gap-14 pt-12 lg:gap-20 lg:pt-16">
        <SectionHead id="evidence-heading" heading={copy.evidenceHeading} lede={copy.evidenceLede} split />
        <ol className="flex flex-col gap-20 lg:gap-28">
          {copy.evidence.map((item) => (
            <Evidence key={item.claim} item={item} docsHref={docsHref} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="team-heading" className="home-frame mt-28 bg-fd-card py-20 lg:mt-40 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="flex flex-col gap-12 lg:col-span-6">
            <SectionHead id="team-heading" heading={copy.teamHeading} />
            <ul className="flex flex-col gap-10">
              {copy.team.map((item) => (
                <li key={item.title} className="home-reveal flex flex-col gap-2">
                  <h3 className="text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold tracking-tight break-keep">{item.title}</h3>
                  <p className="max-w-[44ch] text-[17px] leading-relaxed text-pretty break-keep">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div data-ui className="home-reveal flex flex-col gap-5 self-start rounded-md bg-fd-background p-6 lg:col-span-6 lg:p-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-[19px] font-semibold break-keep">{copy.ladderHeading}</h3>
              <p className="text-[15px] text-fd-muted-foreground break-keep">{copy.ladderLede}</p>
            </div>
            <ol className="flex flex-col gap-3">
              {copy.ladder.map((layer, index) => (
                <li key={layer.name} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_7rem_1fr]">
                  <span
                    aria-hidden
                    className={`h-2 -translate-y-px justify-self-end rounded-full ${index === 0 ? 'bg-brand' : 'bg-fd-muted-foreground/50'}`}
                    style={{ width: `${(copy.ladder.length - index) * 0.5 + 0.5}rem` }}
                  />
                  <span className="text-[17px] font-semibold">{layer.name}</span>
                  <span className="col-start-2 text-[15px] text-fd-muted-foreground break-keep sm:col-start-3">{layer.body}</span>
                </li>
              ))}
            </ol>
            <Link to={`${docsHref}/principles`} className="home-link self-start text-[15px] font-medium">
              <span>{copy.principlesLink}</span>
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {guides.length > 0 ? (
        <section
          id="guides"
          aria-labelledby="guides-heading"
          className="home-frame grid scroll-mt-20 gap-10 pt-28 lg:grid-cols-12 lg:gap-x-10 lg:pt-40"
        >
          <SectionHead id="guides-heading" heading={copy.guidesHeading} lede={copy.guidesLede} className="lg:col-span-6" />
          <ul className="-mx-4 flex flex-col lg:col-span-6">
            {guides.map((guide) => {
              const updated = loaderData.updated[guide.slug];
              return (
                <li key={guide.slug} className="home-reveal">
                  <Link
                    to={`${docsHref}/${guide.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 rounded-md px-4 py-4 hover:bg-fd-card motion-safe:transition-colors sm:grid-cols-[11rem_1fr_auto]"
                  >
                    <span className="flex items-center gap-2 text-[19px] font-semibold tracking-tight">
                      {guide.title}
                      <ArrowRight className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="col-span-2 row-start-2 text-[15px] text-fd-muted-foreground break-keep sm:col-span-1 sm:row-start-auto">
                      {guide.blurb}
                    </span>
                    {updated ? (
                      <time dateTime={updated} className="col-start-2 row-start-1 text-sm tabular-nums text-fd-muted-foreground sm:col-start-3">
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

      <footer className="home-frame mt-28 flex flex-col gap-16 bg-fd-card pt-20 pb-8 lg:mt-40 lg:pt-28">
        <section aria-labelledby="contact-heading" className="flex flex-col gap-6">
          <h2
            id="contact-heading"
            className="home-reveal max-w-[16em] text-[clamp(2rem,4.5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance break-keep"
          >
            {copy.contactHeading}
          </h2>
          <p className="home-reveal text-[17px] break-keep">{copy.contactBody}</p>
          <Actions copy={copy} lang={loaderData.lang} links={CONTACT_LINKS} className="home-reveal mt-2" />
        </section>
        <div className="flex flex-col gap-6">
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
        </div>
      </footer>
    </HomeLayout>
  );
};

export default Home;
