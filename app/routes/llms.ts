import type { Route } from './+types/llms';
import { homeCopy, i18n, llmsFullTxt, llmsTxt } from '../lib';

// One module behind four routes (routes.ts): the language is the path's first
// segment when it is one, and `-full` picks the file.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const first = pathname.split('/')[1];
  const lang = i18n.languages.find((language) => language === first) ?? i18n.defaultLanguage;
  const copy = homeCopy(lang);
  const body = pathname.endsWith('llms-full.txt')
    ? await llmsFullTxt(lang)
    : llmsTxt(lang, { title: copy.title, description: copy.description });

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
