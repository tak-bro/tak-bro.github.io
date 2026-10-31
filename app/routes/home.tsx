import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
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

/** A terminal-sized fragment of real output; hook output reads as an error. */
const Session = ({ lines, className = '' }: { lines: readonly string[]; className?: string }) => {
  const hook = hookLines(lines);
  return (
    <pre className={`overflow-x-auto rounded-md bg-fd-background p-5 text-[13px] leading-relaxed whitespace-pre ${className}`}>
      <code className="font-mono">
        {lines.map((line, index) => (
          <span key={index} className={`block min-h-[1lh] ${hook[index] ? 'text-red-700 dark:text-red-300' : ''}`}>
            {line}
          </span>
        ))}
      </code>
    </pre>
  );
};

const SectionHead = ({ id, heading, lede, children }: { id: string; heading: string; lede?: string; children?: ReactNode }) => (
  <div className="home-reveal flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
    <div className="flex flex-col gap-2">
      <h2 id={id} className="text-2xl font-semibold tracking-tight break-keep">
        {heading}
      </h2>
      {lede ? <p className="text-[17px] text-fd-muted-foreground break-keep">{lede}</p> : null}
    </div>
    {children}
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
  <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
    <a href={resumeHref(lang)} rel="noreferrer noopener" target="_blank" className={primaryButton}>
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

/** One answer to a hiring question: the claim on one side, the real output it rests on on the other. */
const Evidence = ({ item, docsHref }: { item: HomeEvidence; docsHref: string }) => (
  <li data-evidence className="home-reveal flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <p className="text-[15px] text-fd-muted-foreground break-keep">{item.question}</p>
      <h3 className="text-2xl font-semibold tracking-tight break-keep">{item.claim}</h3>
      <p className="max-w-[44ch] text-[17px] leading-relaxed break-keep">{item.body}</p>
      <Link to={`${docsHref}/${item.guide}`} className="home-link self-start text-[15px] font-medium">
        <span>{item.guideLabel}</span>
        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
      </Link>
    </div>
    <figure data-ui className="flex flex-col gap-3 rounded-md bg-fd-card p-5">
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
      <section id={CONTENT_ID} aria-labelledby="hero-heading" className="home-frame flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-6">
          <h1 id="hero-heading" className="home-rise flex flex-col gap-4 break-keep">
            <span className="text-xl font-semibold">
              {copy.name} <span className="text-fd-muted-foreground">· {copy.role}</span>
            </span>
            <span className="max-w-[16ch] text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-semibold tracking-tight">{copy.headline}</span>
          </h1>
          <p className="home-rise max-w-[40ch] text-[17px] leading-relaxed break-keep [--i:1]">{copy.lede}</p>
          <Actions copy={copy} lang={loaderData.lang} className="home-rise [--i:2]" />
        </div>
        <dl aria-label={copy.profileLabel} className="flex flex-col gap-3 rounded-md bg-fd-card p-6 text-[15px]">
          {copy.profile.map((item) => (
            <div key={item.term} className="flex flex-col gap-0.5">
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
      </section>

      <section aria-labelledby="evidence-heading" className="home-frame flex flex-col gap-10 pt-32">
        <SectionHead id="evidence-heading" heading={copy.evidenceHeading} lede={copy.evidenceLede} />
        <ol className="flex flex-col gap-24">
          {copy.evidence.map((item) => (
            <Evidence key={item.claim} item={item} docsHref={docsHref} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="team-heading" className="home-frame flex flex-col gap-10 pt-32">
        <SectionHead id="team-heading" heading={copy.teamHeading} />
        <ul className="flex flex-col gap-8">
          {copy.team.map((item) => (
            <li key={item.title} className="home-reveal flex flex-col gap-2">
              <h3 className="text-[19px] font-semibold break-keep">{item.title}</h3>
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-fd-muted-foreground break-keep">{item.body}</p>
            </li>
          ))}
        </ul>
        <div className="home-reveal flex flex-col gap-4">
          <h3 className="text-[19px] font-semibold break-keep">{copy.ladderHeading}</h3>
          <p className="text-[15px] text-fd-muted-foreground break-keep">{copy.ladderLede}</p>
          <ol className="flex flex-col gap-2">
            {copy.ladder.map((layer) => (
              <li key={layer.name} className="flex flex-wrap gap-x-4">
                <span className="font-semibold">{layer.name}</span>
                <span className="text-fd-muted-foreground break-keep">{layer.body}</span>
              </li>
            ))}
          </ol>
          <Link to={`${docsHref}/principles`} className="home-link self-start text-[15px] font-medium">
            <span>{copy.principlesLink}</span>
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </section>

      {guides.length > 0 ? (
        <section id="guides" aria-labelledby="guides-heading" className="home-frame flex scroll-mt-20 flex-col gap-10 pt-32">
          <SectionHead id="guides-heading" heading={copy.guidesHeading} lede={copy.guidesLede} />
          <ul className="flex flex-col">
            {guides.map((guide) => {
              const updated = loaderData.updated[guide.slug];
              return (
                <li key={guide.slug} className="home-reveal">
                  <Link to={`${docsHref}/${guide.slug}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-md px-3 py-3 hover:bg-fd-card">
                    <span className="text-[17px] font-semibold">{guide.title}</span>
                    <span className="text-[15px] text-fd-muted-foreground break-keep">{guide.blurb}</span>
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

      <section aria-labelledby="contact-heading" className="home-frame flex flex-col gap-6 pt-32">
        <h2 id="contact-heading" className="home-reveal text-2xl font-semibold tracking-tight break-keep">
          {copy.contactHeading}
        </h2>
        <p className="home-reveal text-[17px] text-fd-muted-foreground break-keep">{copy.contactBody}</p>
        <Actions copy={copy} lang={loaderData.lang} links={CONTACT_LINKS} className="home-reveal" />
      </section>

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
