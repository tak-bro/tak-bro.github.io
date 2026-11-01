import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowUpRight, CodeXml } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Route } from './+types/home';
import { HomeTerminal } from '../components/home-terminal';
import { primaryButton } from '../components/page-header';
import { baseOptions, CONTENT_ID, GITHUB_URL, homeCopy, localeFromPath, requestPath, resumeHref, type HomeLink } from '../lib';

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

export const loader = ({ request }: Route.LoaderArgs) => ({ lang: localeFromPath(requestPath(request)) });

const ExternalMark = ({ label }: { label: string }) => (
  <>
    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
    <span className="sr-only">{label}</span>
  </>
);

/** Brand marks lucide does not carry (Simple Icons paths, 24×24). */
const BrandMark = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
    <path d={d} />
  </svg>
);

const GITHUB_MARK =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
const LINKEDIN_MARK =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const LINK_ICONS: Record<HomeLink['icon'], ReactNode> = {
  linkedin: <BrandMark d={LINKEDIN_MARK} />,
  github: <BrandMark d={GITHUB_MARK} />,
  source: <CodeXml className="size-5" strokeWidth={1.5} aria-hidden />,
};

/** The second action beside the brand button: the same size, drawn in the border tone. */
const outlineButton =
  'home-press inline-flex min-h-11 items-center gap-2 rounded-sm border border-fd-border px-4 py-2.5 text-[15px] font-semibold hover:bg-fd-card';

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { lang } = loaderData;
  const copy = homeCopy(lang);

  return (
    <HomeLayout {...baseOptions({ lang })}>
      <section id={CONTENT_ID} aria-labelledby="hero-heading" className="home-frame grid flex-1 items-start gap-12 pt-12 pb-24 lg:grid-cols-12 lg:content-center lg:items-center lg:gap-x-10 lg:pt-16 lg:pb-32">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h1 id="hero-heading" className="home-rise text-[clamp(3rem,5.6vw,5.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance break-keep">
            {copy.name}
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

        <section aria-labelledby="terminal-heading" className="lg:col-span-7">
          <h2 id="terminal-heading" className="sr-only">
            {copy.terminalLabel}
          </h2>
          <HomeTerminal copy={copy} />
          <p className="mt-3 text-sm text-fd-muted-foreground break-keep">{copy.logNote}</p>
        </section>
      </section>

      <footer className="bg-fd-card">
        <div className="home-frame flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
          <p className="flex flex-wrap gap-x-4 text-sm text-fd-muted-foreground">
            <span>© 2026 tak-bro</span>
            <a href={`${REPO_URL}/blob/main/LICENSE`} className="underline-offset-4 hover:underline">
              {copy.codeLicense}
            </a>
            <a href={`${REPO_URL}/blob/main/LICENSE-CONTENT`} className="underline-offset-4 hover:underline">
              {copy.contentLicense}
            </a>
          </p>
          <ul className="-mx-2.5 flex flex-wrap">
            {copy.links.map((link) => (
              <li key={link.icon}>
                <a
                  href={link.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  title={link.name}
                  className="flex size-11 items-center justify-center rounded-sm text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground motion-safe:transition-colors"
                >
                  {LINK_ICONS[link.icon]}
                  <span className="sr-only">
                    {link.name}
                    {` ${copy.newTabLabel}`}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </HomeLayout>
  );
};

export default Home;
