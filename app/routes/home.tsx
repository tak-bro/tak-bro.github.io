import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import {
  baseOptions,
  blogPosts,
  GITHUB_URL,
  HOME_CONTENT_ID,
  homeCopy,
  localeFromPath,
  localizedDocsHref,
  requestPath,
  source,
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

// Cards only for guides that exist; check:links fails on a card to an unwritten one.
export const loader = ({ request }: Route.LoaderArgs) => {
  const lang = localeFromPath(requestPath(request));

  return {
    lang,
    postCount: blogPosts().length,
    publishedGuides: homeCopy(lang)
      .guides.map((guide) => guide.slug)
      .filter((slug) => source.getPage([slug], lang) !== undefined),
  };
};

const pad = (index: number) => String(index + 1).padStart(2, '0');

/**
 * The /orch path as a sticky stage: the left column shows the stage whose step sits in the
 * middle of the viewport. Under reduced motion the word swaps without the step animation.
 */
const Stages = ({ label, stages }: { label: string; stages: readonly HomeStage[] }) => {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);

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

  // rootMargin keeps only the top ~6% of the viewport: the band under the sticky header.
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) root.dataset.homeNight = '';
        else delete root.dataset.homeNight;
      },
      { rootMargin: '0px 0px -94% 0px' },
    );
    if (section.current) observer.observe(section.current);
    return () => {
      observer.disconnect();
      delete root.dataset.homeNight;
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="stages-heading" className="home-night">
      <div className="mx-auto grid w-full max-w-6xl gap-x-10 px-5 pt-24 pb-12 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-[calc(50vh-9rem)]">
            <h2 id="stages-heading" className="text-sm font-medium text-(--night-muted)">
              {label}
            </h2>
            <div className="hidden items-start gap-6 lg:flex" aria-hidden>
              <ol className="relative mt-4 flex flex-col gap-5">
                <span className="absolute top-1 bottom-1 left-[3px] w-px bg-(--night-line)" />
                {stages.map((stage, index) => (
                  <li
                    key={stage.word}
                    className={`relative size-[7px] rounded-full transition-colors duration-300 ${index <= active ? 'bg-(--signal)' : 'bg-(--night-line)'}`}
                  />
                ))}
              </ol>
              <p key={active} className="home-stage-word">
                {stages[active]?.word}
              </p>
            </div>
          </div>
        </div>
        <ol className="flex flex-col lg:col-span-7">
          {stages.map((stage, index) => (
            <li
              key={stage.word}
              ref={(node) => {
                steps.current[index] = node;
              }}
              data-active={index === active}
              className="home-step flex flex-col gap-5 border-t border-(--night-line) py-12 lg:min-h-[60vh] lg:justify-center"
            >
              <p className="home-stage-word lg:sr-only">{stage.word}</p>
              <p className="flex gap-3 font-mono text-sm">
                <span className="tabular-nums text-(--night-muted)">{pad(index)}</span>
                <span className="text-(--night-accent)" aria-hidden>
                  &gt;
                </span>
                <code className="break-all">{stage.code}</code>
              </p>
              <p className="max-w-xl text-xl leading-relaxed break-keep sm:text-2xl">{stage.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const copy = homeCopy(loaderData.lang);
  const docsHref = localizedDocsHref(loaderData.lang);
  const guides = copy.guides.filter((guide) => loaderData.publishedGuides.includes(guide.slug));
  const groups = copy.guideGroups
    .map((group) => ({ ...group, guides: guides.filter((guide) => guide.group === group.id) }))
    .filter((group) => group.guides.length > 0);

  return (
    <HomeLayout {...baseOptions({ lang: loaderData.lang })}>
      <section id={HOME_CONTENT_ID} className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-14 pb-20 sm:pt-20">
        <div className="home-rise [--i:0] flex items-start justify-between gap-6 text-sm">
          <p className="flex flex-col">
            <span className="font-semibold">{copy.name}</span>
            <span className="text-fd-muted-foreground">{copy.role}</span>
          </p>
          <p className="text-right text-fd-muted-foreground tabular-nums">
            {copy.statGuides} <span className="text-fd-foreground">{guides.length}</span>
            <span className="hidden sm:inline" aria-hidden> · </span>
            <br className="sm:hidden" />
            {copy.statPosts} <span className="text-fd-foreground">{loaderData.postCount}</span>
          </p>
        </div>
        <h1 className="home-mega mt-16 sm:mt-24">
          {copy.heroLines.map((line, index) => (
            <span key={line} className={`home-rise block ${index === 0 ? '[--i:1]' : '[--i:2]'}`}>
              {line}
            </span>
          ))}
        </h1>
        <div
          className="home-rise [--i:3] mt-12 flex flex-col gap-4 border-y border-fd-foreground/15 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex min-w-0 items-center gap-3 font-mono text-[15px] sm:text-lg">
            <span className="text-brand" aria-hidden>
              &gt;
            </span>
            <code className="break-keep">{copy.prompt}</code>
            <span className="home-cursor" aria-hidden />
          </p>
          <Link
            to={`${docsHref}/workflow`}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-fd-foreground px-5 py-3 text-sm font-semibold text-fd-background transition-[background-color,scale] duration-300 hover:bg-brand active:scale-[0.97] sm:self-auto"
          >
            {copy.promptCta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <div className="home-rise [--i:4] mt-10 grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-3 break-keep lg:col-span-7">
            <p className="text-lg leading-relaxed sm:text-xl">{copy.bio}</p>
            <p className="leading-relaxed text-fd-muted-foreground">{copy.intro}</p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium lg:col-span-4 lg:col-start-9 lg:items-end">
            <Link className="home-link" to={docsHref}>
              <span>{copy.docsCta}</span>
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
            <a className="home-link" href={GITHUB_URL} rel="noreferrer noopener" target="_blank">
              <span>GitHub</span>
              <span className="sr-only">{copy.newTabLabel}</span>
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
            <a className="home-link" href={copy.resumeHref}>
              <span>{copy.resumeLabel}</span>
              <FileText className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
          </div>
        </div>
      </section>
      <Stages label={copy.stagesLabel} stages={copy.stages} />
      {groups.length > 0 ? (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-24 sm:py-32" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="flex items-baseline justify-between border-b-2 border-fd-foreground pb-3">
            <span className="text-sm font-semibold">{copy.guidesHeading}</span>
            <span className="text-sm tabular-nums text-fd-muted-foreground">{guides.length}</span>
          </h2>
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-fd-muted-foreground">{group.heading}</h3>
              <ol className="flex flex-col">
                {group.guides.map((guide) => (
                  <li key={guide.slug} className="border-b">
                    <Link
                      className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 py-7 sm:grid-cols-[6rem_1fr_auto]"
                      to={`${docsHref}/${guide.slug}`}
                    >
                      <span className="text-sm tabular-nums text-fd-muted-foreground transition-colors group-hover:text-brand" aria-hidden>
                        {pad(copy.guides.indexOf(guide))}
                      </span>
                      <span className="flex flex-col gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight transition-[translate,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-brand sm:text-4xl">
                          {guide.title}
                        </span>
                        <span className="text-fd-muted-foreground break-keep">{guide.blurb}</span>
                      </span>
                      <ArrowRight
                        className="size-5 self-center text-fd-muted-foreground transition duration-300 group-hover:translate-x-1 group-hover:text-brand"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      ) : null}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-6 text-sm text-fd-muted-foreground">
          <span>© 2026 tak-bro</span>
          <span className="flex gap-3">
            <a href={`${REPO_URL}/blob/main/LICENSE`} className="inline-block py-1 underline-offset-4 hover:underline">
              {copy.codeLicense}
            </a>
            <a href={`${REPO_URL}/blob/main/LICENSE-CONTENT`} className="inline-block py-1 underline-offset-4 hover:underline">
              {copy.contentLicense}
            </a>
          </span>
        </div>
      </footer>
    </HomeLayout>
  );
};

export default Home;
