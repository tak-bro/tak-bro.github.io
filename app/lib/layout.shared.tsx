import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n, localizedDocsHref } from './i18n';
import { APP_NAME } from './shared';

interface LayoutOptions {
  /** The page's language, for the guides link. */
  readonly lang?: string;
  /** False on a page with no translation to switch to (a 404 outside the homes and docs). */
  readonly localized?: boolean;
}

// Passing the config (not just `true`) is what puts the language switcher in the
// layout chrome; without it /en is reachable by URL only. The active locale comes
// from the i18n provider in root.tsx.
export const baseOptions = ({ lang = i18n.defaultLanguage, localized = true }: LayoutOptions = {}): BaseLayoutProps => ({
  nav: {
    title: (
      <>
        <span className="font-semibold">{APP_NAME}</span>
      </>
    ),
  },
  links: [{ text: "Tak's config", url: localizedDocsHref(lang) }],
  i18n: localized ? i18n : false,
});
