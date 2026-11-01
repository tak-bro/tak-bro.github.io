import { i18n } from '../../lib/i18n';

/** Every diagram takes the page language from the MDX component map (docsMdxComponents). */
export interface DiagramLangProps {
  readonly lang?: string;
}

/** The copy for `lang`, else the default language's: a diagram is never drawn without labels. */
export const pick = <Copy>(copies: Record<'ko' | 'en', Copy>, lang: string | undefined): Copy =>
  copies[(lang ?? i18n.defaultLanguage) as 'ko' | 'en'] ?? copies[i18n.defaultLanguage as 'ko' | 'en'];
