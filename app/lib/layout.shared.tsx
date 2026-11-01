import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { languageSelectSlot } from '../components/language-select';
import { TakLogo } from '../components/tak-logo';
import { i18n, localized as byLang, resumeHref } from './i18n';
import { GITHUB_URL } from './shared';

const RESUME_LABELS: Record<string, string> = { ko: '이력서', en: 'Resume' };

interface LayoutOptions {
  /** The page's language, for the resume link. */
  readonly lang?: string;
  /** False on a page with no translation to switch to (a 404 outside the homes and docs). */
  readonly localized?: boolean;
}

// Passing the config (not just `true`) is what puts the language switcher in the
// layout chrome; without it /en is reachable by URL only. The active locale comes
// from the i18n provider in root.tsx.
export const baseOptions = ({ lang = i18n.defaultLanguage, localized = true }: LayoutOptions = {}): BaseLayoutProps => ({
  nav: {
    // The wordmark names the site in the nav on every page (home, guides, 404).
    title: <TakLogo className="h-4.5 w-auto" />,
  },
  links: [
    { text: byLang(RESUME_LABELS, lang), url: resumeHref(lang), external: true },
    { text: 'GitHub', url: GITHUB_URL, external: true },
  ],
  i18n: localized ? i18n : false,
  slots: { languageSelect: languageSelectSlot },
});
