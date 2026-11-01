import { i18n } from './i18n';
import { GITHUB_URL, LINKEDIN_URL, RESUME_HREF } from './shared';

/** One guide in the list: `slug` is the top-level page under content/docs. */
export interface HomeGuide {
  readonly slug: string;
  readonly title: string;
  readonly blurb: string;
}

export interface HomeLink {
  readonly name: string;
  readonly href: string;
}

export interface HomeCopy {
  /** The site name, for llms.txt. */
  readonly title: string;
  readonly documentTitle: string;
  readonly description: string;
  readonly name: string;
  /** The topic line, the page's h1. */
  readonly headline: string;
  readonly lede: string;
  readonly resumeLabel: string;
  readonly guidesHeading: string;
  readonly guidesLede: string;
  readonly guides: readonly HomeGuide[];
  readonly about: string;
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

const GUIDE_SLUGS = ['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps'] as const;

const guides = (lines: Record<(typeof GUIDE_SLUGS)[number], readonly [string, string]>): HomeGuide[] =>
  GUIDE_SLUGS.map((slug) => ({ slug, title: lines[slug][0], blurb: lines[slug][1] }));

const footerLinks = (resume: string, resumeHref: string, source: string): HomeLink[] => [
  { name: 'LinkedIn', href: LINKEDIN_URL },
  { name: 'GitHub', href: GITHUB_URL },
  { name: 'hwip', href: 'https://hwip.app' },
  { name: resume, href: resumeHref },
  { name: source, href: `${GITHUB_URL}/tak-bro.github.io` },
];

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Tak (Hyungtak Jin) — coding-agent harnesses',
  description:
    'How I build coding-agent harnesses and work with them: setup guides by Tak (Hyungtak Jin).',
  name: 'Tak (Hyungtak Jin)',
  // U+2011 keeps 'coding-agent' on one line.
  headline: 'How I build and use coding‑agent harnesses',
  lede: 'I have built web, React Native and Electron apps since 2018. Today I work through Claude Code, opencode and pi with my own rules, hooks and skills. These guides show that setup as it is, and why it is that way.',
  resumeLabel: 'Resume',
  guidesHeading: 'Setup guides',
  guidesLede: 'The config as it is, with the reasons behind it. Read as much as you need.',
  guides: guides({
    principles: ['Principles', 'Why the setup looks the way it does.'],
    'agent-config': ['Agent config', 'Rules, hooks and subagents for three harnesses.'],
    workflow: ['Workflow', 'From a one-line request to a merged PR.'],
    plugins: ['Plugins and MCP', 'What stays on, and why.'],
    herdr: ['Herdr', 'The terminal workspace and its keys.'],
    keymaps: ['Keymaps', 'macOS, Ghostty, Karabiner, LazyVim.'],
  }),
  about: 'Tak (Hyungtak Jin)',
  links: footerLinks('Resume', RESUME_HREF.en, 'Site source'),
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Tak(진형탁) — 코딩 에이전트 하네스',
  description: 'Tak(진형탁)이 코딩 에이전트 하네스를 만들고 쓰는 법을 정리한 셋업 가이드예요.',
  name: 'Tak(진형탁)',
  headline: '코딩 에이전트 하네스를 만들고 쓰는 법',
  lede: '2018년부터 웹, React Native, Electron으로 앱을 만들어 왔어요. 지금은 Claude Code, opencode, pi에 제 규칙과 훅, 스킬을 붙여 일해요. 그 설정을 있는 그대로 옮기고, 왜 그렇게 했는지 함께 적었어요.',
  resumeLabel: '이력서',
  guidesHeading: '셋업 가이드',
  guidesLede: '설정 원문과 그렇게 한 이유를 적었어요. 필요한 만큼만 읽어도 돼요.',
  guides: guides({
    principles: ['원칙', '셋업이 이렇게 생긴 이유.'],
    'agent-config': ['에이전트 설정', '세 하네스의 규칙·훅·서브에이전트.'],
    workflow: ['워크플로우', '한 줄 요청에서 머지까지.'],
    plugins: ['플러그인·MCP', '켜 두는 플러그인과 그 이유.'],
    herdr: ['Herdr', '터미널 작업 공간과 단축키.'],
    keymaps: ['키맵', 'macOS, Ghostty, Karabiner, LazyVim.'],
  }),
  about: 'Tak(진형탁)',
  links: footerLinks('이력서', RESUME_HREF.ko, '사이트 소스'),
  codeLicense: '코드: MIT',
  contentLicense: '문서: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
