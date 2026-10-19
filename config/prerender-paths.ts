import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { i18n } from '../app/lib/i18n';
import { DOCS_ROUTE } from '../app/lib/shared';

const getUrl = createGetUrl(DOCS_ROUTE, i18n);

// Non-default locales are encoded in the filename: index.en.mdx. getSlugs() has no
// notion of that, so the suffix is stripped here before slugs are derived —
// otherwise the English page would register as a page literally named "en".
const NON_DEFAULT_LANGUAGES = i18n.languages.filter((lang) => lang !== i18n.defaultLanguage);

const splitLocale = (file: string): { file: string; locale?: string } => {
  for (const locale of NON_DEFAULT_LANGUAGES) {
    const suffix = `.${locale}.mdx`;
    if (file.endsWith(suffix)) {
      return { file: `${file.slice(0, -suffix.length)}.mdx`, locale };
    }
  }

  return { file };
};

/**
 * URLs react-router must prerender for the given content files.
 *
 * Every page gets a URL in **every** language, not just the languages it has a
 * file for. fumadocs falls back to the default language when a translation is
 * missing, so the untranslated page still exists, still gets indexed for search,
 * and is still linked from the language switcher. Prerendering only the
 * translated ones leaves those URLs as 404s that nothing in the app reveals.
 *
 * The default language is unprefixed and every other one is, matching
 * `hideLocale: 'default-locale'`.
 */
export const docsPrerenderPaths = (mdxFiles: readonly string[]): string[] => {
  const baseFiles = [...new Set(mdxFiles.map((entry) => splitLocale(entry).file))].sort();

  return baseFiles.flatMap((file) => {
    const slugs = getSlugs(file);

    return i18n.languages.map((locale) => getUrl(slugs, locale));
  });
};
