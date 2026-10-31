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

/** A list section: its heading, one line under it, and the link to the whole list. */
export interface HomeListCopy {
  readonly heading: string;
  readonly lede: string;
  readonly all: string;
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
  readonly posts: HomeListCopy;
  readonly projects: HomeListCopy;
  /** Caption of the one output fragment next to the projects. */
  readonly sampleCaption: string;
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
    'Building coding-agent harnesses, and working with them. Posts, projects and setup guides by Tak (Hyungtak Jin).',
  name: 'Tak (Hyungtak Jin)',
  // U+2011 keeps 'coding-agent' on one line.
  headline: 'Building coding‑agent harnesses, and working with them',
  lede: 'I have built web, React Native and Electron apps since 2018. Now I work through Claude Code, opencode and pi with my own rules, hooks and skills, and write down the setup and the work here.',
  resumeLabel: 'Resume',
  posts: { heading: 'Posts', lede: 'Notes from building the harness and working with it. Written in Korean.', all: 'All posts' },
  projects: { heading: 'Projects', lede: 'Things I built to work with coding agents. The pages are in Korean.', all: 'All projects' },
  sampleCaption: 'tak-cc-statusline, under Claude Code',
  guidesHeading: 'Setup guides',
  guidesLede: 'The real config and why it is that way. Read as much as you like.',
  guides: guides({
    principles: ['Principles', 'Why the setup looks the way it does.'],
    'agent-config': ['Agent config', 'Rules, hooks and subagents for three harnesses.'],
    workflow: ['Workflow', 'From one line to a merged PR.'],
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
  description: '코딩 에이전트 하네스를 만들고, 그걸로 일한 기록. Tak(진형탁)의 글, 프로젝트, 셋업 가이드.',
  name: 'Tak(진형탁)',
  headline: '코딩 에이전트 하네스를 만들고, 그걸로 일한 기록',
  lede: '2018년부터 웹, React Native, Electron으로 앱을 만들어 왔다. 지금은 Claude Code, opencode, pi에 내 규칙과 훅, 스킬을 붙여 일하고, 그 설정과 일한 기록을 여기에 쓴다.',
  resumeLabel: '이력서',
  posts: { heading: '글', lede: '하네스를 고치고, 그걸로 일하면서 남긴 노트.', all: '모든 글' },
  projects: { heading: '프로젝트', lede: '코딩 에이전트와 일하려고 만든 것들.', all: '모든 프로젝트' },
  sampleCaption: 'tak-cc-statusline, Claude Code 아래 한 줄',
  guidesHeading: '셋업 가이드',
  guidesLede: '설정 원문과 그렇게 한 이유. 원하는 만큼만 읽으면 된다.',
  guides: guides({
    principles: ['원칙', '셋업이 이렇게 생긴 이유.'],
    'agent-config': ['에이전트 설정', '세 하네스의 규칙, 훅, 서브에이전트.'],
    workflow: ['워크플로우', '한 줄에서 머지까지.'],
    plugins: ['플러그인·MCP', '켜 두는 것과 그 이유.'],
    herdr: ['Herdr', '터미널 작업 공간과 단축키.'],
    keymaps: ['키맵', 'macOS, Ghostty, Karabiner, LazyVim.'],
  }),
  about: 'Tak(진형탁)',
  links: footerLinks('이력서', RESUME_HREF.ko, '사이트 소스'),
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
