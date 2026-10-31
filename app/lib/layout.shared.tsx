import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n, localizedDocsHref, resumeHref } from './i18n';
import { APP_NAME, BLOG_ROUTE, GITHUB_URL, PROJECTS_ROUTE } from './shared';

// The posts and projects are Korean only, so both languages link the same pages. LinkedIn sits in the home footer.
const NAV_LABELS: Record<string, { posts: string; projects: string; guides: string; resume: string }> = {
  ko: { posts: '글', projects: '프로젝트', guides: '가이드', resume: '이력서' },
  en: { posts: 'Posts', projects: 'Projects', guides: 'Guides', resume: 'Resume' },
};

interface LayoutOptions {
  /** The page's language, for the nav labels. */
  readonly lang?: string;
  /** False on a Korean-only page, which has no translation to switch to. */
  readonly localized?: boolean;
}

// Passing the config (not just `true`) is what puts the language switcher in the
// layout chrome; without it /en is reachable by URL only. The active locale comes
// from the i18n provider in root.tsx.
export const baseOptions = ({ lang = i18n.defaultLanguage, localized = true }: LayoutOptions = {}): BaseLayoutProps => {
  const labels = NAV_LABELS[lang] ?? NAV_LABELS[i18n.defaultLanguage];

  return {
    nav: {
      title: (
        <>
          <span className="font-semibold">{APP_NAME}</span>
        </>
      ),
    },
    links: [
      { text: labels.posts, url: BLOG_ROUTE },
      { text: labels.projects, url: PROJECTS_ROUTE },
      { text: labels.guides, url: localizedDocsHref(lang) },
      { text: labels.resume, url: resumeHref(lang), external: true },
      { text: 'GitHub', url: GITHUB_URL, external: true },
    ],
    i18n: localized ? i18n : false,
  };
};
