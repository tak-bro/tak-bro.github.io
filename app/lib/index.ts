export { homeCopy, type HomeCopy, type HomeGuide } from './home-copy';
export { alternateLinks, i18n, isLocalizedPath, localeFromPath, localeSwitchPath, localizedDocsHref, type AlternateLink } from './i18n';
export { baseOptions } from './layout.shared';
export { llmsFullTxt, llmsTxt } from './llms';
export { resolveDocsHref } from './relative-href';
export { requestPath } from './request-path';
export { robotsTxt } from './robots';
export {
  APP_NAME,
  BLOG_CONTENT_DIR,
  BLOG_ROUTE,
  DOCS_CONTENT_DIR,
  DOCS_ROUTE,
  pageTitle,
  PROJECTS_CONTENT_DIR,
  PROJECTS_ROUTE,
} from './shared';
export { canonicalUrl, IS_PROD, ogLocale, SITE_URL } from './site';
export { sitemapEntries, sitemapXml, type SitemapEntry } from './sitemap';
export { blog, blogPosts, blogSource, docs, projectPages, projects, projectsSource, source } from './source';
export { translations } from './translations';
