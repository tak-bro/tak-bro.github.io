import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { HomeTerminal } from '../components/home-terminal';
import { primaryButton } from '../components/page-header';
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
// Guides only for pages that exist; check:links fails on a link to an unwritten one.
export const loader = ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));
  const publishedGuides = homeCopy(lang).guides.flatMap((guide) => (source.getPage([guide.slug], lang) ? [guide.slug] : []));
  return { lang, publishedGuides };
};

const ExternalMark = ({ label }: { label: string }) => (
  <>
    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
    <span className="sr-only">{label}</span>
  </>
);

/** "Tak (Hyungtak Jin)" breaks before the parenthesis, never inside it. */
const NameLines = ({ name }: { name: string }) => {
  const at = name.indexOf('(');
  if (at < 0) return name;
  return (
    <>
      {name.slice(0, at)}
      <span className="whitespace-nowrap">{name.slice(at)}</span>
    </>
  );
};

const isExternal = (href: string) => href.startsWith('http');

/** The second action beside the brand button: the same size, drawn in the border tone. */
const outlineButton =
  'home-press inline-flex min-h-11 items-center gap-2 rounded-sm border border-fd-border px-4 py-2.5 text-[15px] font-semibold hover:bg-fd-card';

const external = (link: { href: string }) => (isExternal(link.href) ? { rel: 'noreferrer noopener', target: '_blank' } : {});

/** One guide in the left column: its title and one line, the whole row a link. */
const GuideRow = ({ to, title, line }: { to: string; title: string; line: string }) => (
  <li>
    <Link to={to} className="group grid grid-cols-[9.5rem_1fr] items-baseline gap-x-4 rounded-sm py-1.5 break-keep max-sm:grid-cols-1">
      <span className="text-[15px] font-medium">
        {title}
        <ArrowRight
          className="ml-1.5 inline size-3.5 -translate-y-px motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <span className="text-[15px] text-fd-muted-foreground">{line}</span>
    </Link>
  </li>
);

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { lang } = loaderData;
  const copy = homeCopy(lang);
  const docsHref = localizedDocsHref(lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));

  return (
    <HomeLayout {...baseOptions({ lang })}>
      <section id={CONTENT_ID} aria-labelledby="hero-heading" className="home-frame grid items-start gap-12 pt-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8 lg:pt-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h1 id="hero-heading" className="home-rise text-[clamp(min(3rem,13vw),5.6vw,5.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance break-keep">
            <NameLines name={copy.name} />
          </h1>
          <p className="home-rise max-w-[40ch] text-[clamp(1.0625rem,1.3vw,1.1875rem)] leading-relaxed text-pretty break-keep [--i:1]">
            {copy.lede}
          </p>
          <ul className="home-rise flex flex-wrap gap-3 [--i:2]">
            <li>
              <a href={resumeHref(lang)} rel="noreferrer noopener" target="_blank" className={`${primaryButton} min-h-11`}>
                <span>{copy.resumeLabel}</span>
                <ExternalMark label={copy.newTabLabel} />
              </a>
            </li>
            <li>
              <a href={GITHUB_URL} rel="noreferrer noopener" target="_blank" className={outlineButton}>
                <span>GitHub</span>
                <ExternalMark label={copy.newTabLabel} />
              </a>
            </li>
          </ul>
        </div>
        {guides.length > 0 ? (
          <nav aria-labelledby="guides-heading" className="home-rise flex flex-col gap-2 border-t border-fd-border pt-6 [--i:3] max-lg:order-last lg:col-span-5">
            <h2 id="guides-heading" className="text-[15px] font-medium text-fd-muted-foreground">
              {copy.guidesHeading}
            </h2>
            <ul className="flex flex-col">
              {guides.map((guide) => (
                <GuideRow key={guide.slug} to={`${docsHref}/${guide.slug}`} title={guide.title} line={guide.blurb} />
              ))}
            </ul>
          </nav>
        ) : null}

        <section aria-labelledby="terminal-heading" className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <h2 id="terminal-heading" className="sr-only">
            {copy.terminalLabel}
          </h2>
          <HomeTerminal copy={copy} docsHref={docsHref} />
          <p className="mt-3 text-sm text-fd-muted-foreground break-keep">{copy.logNote}</p>
        </section>
      </section>

      <footer className="home-frame mt-24 flex flex-col gap-6 bg-fd-card pt-16 pb-8 lg:mt-32 lg:pt-20">
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
