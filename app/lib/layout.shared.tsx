import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n, localizedDocsHref, resumeHref } from './i18n';
import { APP_NAME, GITHUB_URL } from './shared';

const NAV_LABELS: Record<string, { guides: string; resume: string }> = {
  ko: { guides: '가이드', resume: '이력서' },
  en: { guides: 'Guides', resume: 'Resume' },
};

interface LayoutOptions {
  /** The page's language, for the nav labels. */
  readonly lang?: string;
  /** False on a page with no translation to switch to (a 404 outside the homes and docs). */
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
      { text: labels.guides, url: localizedDocsHref(lang) },
      { text: labels.resume, url: resumeHref(lang), external: true },
      { text: 'GitHub', url: GITHUB_URL, external: true },
    ],
    i18n: localized ? i18n : false,
  };
};
