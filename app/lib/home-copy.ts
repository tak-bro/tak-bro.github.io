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

/**
 * One turn of the agent in the home's Claude Code session, and the guide that explains it.
 * `say` is a line the agent printed; `tool` is a call (`Skill(ship)`) and the result under it.
 */
export type HomeSessionLine =
  | { readonly kind: 'say'; readonly text: string; readonly guide: GuideSlug }
  | { readonly kind: 'tool'; readonly call: string; readonly result: string; readonly blocked?: boolean; readonly guide: GuideSlug };

export interface HomeCopy {
  /** The site name, for llms.txt. */
  readonly title: string;
  readonly documentTitle: string;
  readonly description: string;
  /** The person's name, the page's h1. */
  readonly name: string;
  readonly lede: string;
  readonly resumeLabel: string;
  /** The terminal: its name for screen readers, the request typed into Claude Code, and lines from the real session. */
  readonly terminalLabel: string;
  readonly request: string;
  readonly session: readonly HomeSessionLine[];
  readonly logNote: string;
  readonly guidesHeading: string;
  readonly guides: readonly HomeGuide[];
  readonly about: string;
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

const GUIDE_SLUGS = ['principles', 'agent-config', 'workflow', 'knowledge', 'plugins', 'herdr', 'keymaps'] as const;
type GuideSlug = (typeof GUIDE_SLUGS)[number];

const guides = (lines: Record<GuideSlug, readonly [string, string]>): HomeGuide[] =>
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
  lede: 'I have built web, React Native and Electron apps since 2018. Now I write the rules for the coding agents that build them, and these guides show that setup and why.',
  resumeLabel: 'Resume',
  terminalLabel: 'Claude Code session',
  request: '/orch drop the posts and projects, polish the guides, and redraw them with diagrams',
  session: [
    { kind: 'say', text: 'orch: change · L · done: /blog 404 · every guide polite Korean · a diagram each', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(01-plan)', result: 'contract frozen 35485d5f · 12 rows, red before any code', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(03-review) slice 04', result: 'FAIL → PASS · one fix loop', guide: 'workflow' },
    { kind: 'tool', call: 'Bash(git commit)', result: '[commit-convention] blocked — AI co-author trailer', blocked: true, guide: 'agent-config' },
    { kind: 'tool', call: 'Skill(review --full)', result: 'cross-model: sonnet · only opus 1', guide: 'agent-config' },
    { kind: 'tool', call: 'Bash(verify-check.sh --all)', result: '12/12 green', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(ship)', result: 'committed → draft PR #20', guide: 'workflow' },
  ],
  logNote: 'Lines picked from the Claude Code session that rebuilt this site.',
  guidesHeading: 'Setup guides',
  guides: guides({
    principles: ['Principles', 'Why the setup looks the way it does.'],
    'agent-config': ['Agent config', 'Rules, hooks and subagents for three harnesses.'],
    workflow: ['Workflow', 'From a one-line request to a merged PR.'],
    knowledge: ['Knowledge loop', 'Where a finished task’s record goes.'],
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
  lede: '2018년부터 웹·React Native·Electron 앱을 만들었고, 지금은 그 앱을 만드는 코딩 에이전트의 규칙을 만들어요. 그 설정과 이유를 가이드로 적었어요.',
  resumeLabel: '이력서',
  terminalLabel: 'Claude Code 세션',
  request: '/orch 글·프로젝트 없애고, 가이드 윤문하고, 다이어그램 적극 활용해서 재개정해',
  session: [
    { kind: 'say', text: 'orch: change · L · 완료: /blog 404 · 가이드 해요체 · 가이드마다 그림', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(01-plan)', result: 'contract frozen 35485d5f · 12행, 구현 전 red 확인', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(03-review) slice 04', result: 'FAIL → PASS · fix 루프 1회', guide: 'workflow' },
    { kind: 'tool', call: 'Bash(git commit)', result: '[commit-convention] 차단 — AI co-author 트레일러', blocked: true, guide: 'agent-config' },
    { kind: 'tool', call: 'Skill(review --full)', result: 'cross-model: sonnet · only opus 1', guide: 'agent-config' },
    { kind: 'tool', call: 'Bash(verify-check.sh --all)', result: '12/12 green', guide: 'workflow' },
    { kind: 'tool', call: 'Skill(ship)', result: 'committed → draft PR #20', guide: 'workflow' },
  ],
  logNote: '이 사이트를 고친 실제 Claude Code 세션에서 골랐어요.',
  guidesHeading: '셋업 가이드',
  guides: guides({
    principles: ['원칙', '셋업이 이렇게 생긴 이유.'],
    'agent-config': ['에이전트 설정', '세 하네스의 규칙·훅·서브에이전트.'],
    workflow: ['워크플로우', '한 줄 요청에서 머지까지.'],
    knowledge: ['지식 루프', '끝난 작업의 기록이 가는 곳.'],
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
