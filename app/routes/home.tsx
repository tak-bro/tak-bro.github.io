import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
// By path, not through the components barrel: the home loads only its own diagram.
import { SetupMapDiagram } from '../components/diagrams/setup-map';
import { baseOptions, CONTENT_ID, GITHUB_URL, homeCopy, localeFromPath, localizedDocsHref, requestPath, resumeHref, source } from '../lib';

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
// Guide rows only for guides that exist; check:links fails on a link to an unwritten one.
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

/** Every section heading sits on the same left edge at the same size. */
const SectionHead = ({ id, heading, lede }: { id: string; heading: string; lede: string }) => (
  <div className="home-reveal flex flex-col gap-3">
    <h2 id={id} className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] font-semibold tracking-tight text-balance break-keep">
      {heading}
    </h2>
    <p className="max-w-[48ch] text-[17px] leading-relaxed text-fd-muted-foreground break-keep">{lede}</p>
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

/** One guide row: the title and an arrow, one line, the last commit date; the title takes its own column from `sm`. */
const IndexRow = ({ to, title, line, meta }: { to: string; title: string; line: string; meta: string | null }) => (
  <li className="home-reveal">
    <Link
      to={to}
      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 rounded-md px-4 py-4 hover:bg-fd-card motion-safe:transition-colors sm:grid-cols-[11rem_1fr_auto]"
    >
      <span className="text-[19px] font-semibold tracking-tight text-pretty break-keep">
        {title}
        <ArrowRight
          className="ml-2 inline size-4 -translate-y-px motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <span className="col-span-2 row-start-2 text-[15px] text-fd-muted-foreground break-keep sm:col-span-1 sm:row-start-auto">
        {line}
      </span>
      {meta ? (
        <time dateTime={meta} className="col-start-2 row-start-1 text-sm tabular-nums text-fd-muted-foreground sm:col-start-3">
          {meta}
        </time>
      ) : null}
    </Link>
  </li>
);

/** Elements below the fold rise in once as they enter; anything already on screen is left alone. */
const useReveal = () => {
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const fold = window.innerHeight;
    const pending = [...document.querySelectorAll<HTMLElement>('.home-reveal')].filter((element) => element.getBoundingClientRect().top > fold);
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
  const { lang } = loaderData;
  const copy = homeCopy(lang);
  const docsHref = localizedDocsHref(lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));
  const heroLinks = [
    { name: copy.resumeLabel, href: resumeHref(lang) },
    { name: 'GitHub', href: GITHUB_URL },
  ];
  useReveal();

  return (
    <HomeLayout {...baseOptions({ lang })}>
      <section id={CONTENT_ID} aria-labelledby="hero-heading" className="home-frame flex flex-col gap-8 pt-12 lg:gap-10 lg:pt-16">
        <div className="home-rise flex flex-col gap-5 break-keep">
          <p className="text-[clamp(1.125rem,1.5vw,1.375rem)] font-semibold">{copy.name}</p>
          <h1 id="hero-heading" className="max-w-[13em] text-[clamp(2rem,6.2vw,6rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
            {copy.headline}
          </h1>
        </div>
        <p className="home-rise max-w-[46ch] text-[clamp(1.0625rem,1.3vw,1.1875rem)] leading-relaxed text-pretty break-keep [--i:1]">
          {copy.lede}
        </p>
        <ul className="home-rise flex flex-wrap gap-x-7 gap-y-3 [--i:2]">
          {heroLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} rel="noreferrer noopener" target="_blank" className="home-link text-[15px] font-medium">
                <span>{link.name}</span>
                <ExternalMark label={copy.newTabLabel} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {guides.length > 0 ? (
        <section id="guides" aria-labelledby="guides-heading" className="home-frame grid scroll-mt-20 gap-10 pt-28 lg:grid-cols-12 lg:gap-x-10 lg:pt-40">
          <div className="lg:col-span-6">
            <SectionHead id="guides-heading" heading={copy.guidesHeading} lede={copy.guidesLede} />
            <div className="home-reveal max-w-[360px]">
              <SetupMapDiagram lang={lang} />
            </div>
          </div>
          <ul className="-mx-4 flex flex-col lg:col-span-6">
            {guides.map((guide) => (
              <IndexRow key={guide.slug} to={`${docsHref}/${guide.slug}`} title={guide.title} line={guide.blurb} meta={loaderData.updated[guide.slug]} />
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="home-frame mt-28 flex flex-col gap-6 bg-fd-card pt-16 pb-8 lg:mt-40 lg:pt-20">
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
