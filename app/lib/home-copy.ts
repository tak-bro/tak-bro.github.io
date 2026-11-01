import { localized } from './i18n';
import { GITHUB_URL, LINKEDIN_URL, RESUME_HREF } from './shared';

/** A footer link, drawn as its icon; `name` is its accessible name and tooltip. */
export interface HomeLink {
  readonly icon: 'linkedin' | 'github' | 'hwip' | 'resume' | 'source';
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
  /** The guide a session line points to, by its top-level page under content/docs. */
  readonly guideTitles: Readonly<Record<GuideSlug, string>>;
  readonly about: string;
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

type GuideSlug = 'principles' | 'agent-config' | 'workflow' | 'knowledge' | 'plugins' | 'herdr' | 'keymaps';

const footerLinks = (resume: string, resumeHref: string, source: string): HomeLink[] => [
  { icon: 'linkedin', name: 'LinkedIn', href: LINKEDIN_URL },
  { icon: 'github', name: 'GitHub', href: GITHUB_URL },
  { icon: 'hwip', name: 'hwip', href: 'https://hwip.app' },
  { icon: 'resume', name: resume, href: resumeHref },
  { icon: 'source', name: source, href: `${GITHUB_URL}/tak-bro.github.io` },
];

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Tak (Hyungtak Jin) — coding-agent harnesses',
  description:
    'How I build coding-agent harnesses and work with them: setup guides by Tak (Hyungtak Jin).',
  name: 'Tak (Hyungtak Jin)',
  lede: 'Software engineer. I started on ultrasound device software at GE Healthcare in 2015, have built web, mobile and desktop products since 2018, and now shape how I work with coding agents.',
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
  guideTitles: {
    principles: 'Principles',
    'agent-config': 'Agent config',
    workflow: 'Workflow',
    knowledge: 'Knowledge loop',
    plugins: 'Plugins and MCP',
    herdr: 'Herdr',
    keymaps: 'Keymaps',
  },
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
  lede: '소프트웨어 엔지니어예요. 2015년 GE Healthcare에서 초음파 의료기기 소프트웨어로 시작했고, 2018년부터 웹·앱·데스크톱 제품을 만들고 있어요. 요즘은 코딩 에이전트와 일하는 방식을 다듬어요.',
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
  guideTitles: {
    principles: '원칙',
    'agent-config': '에이전트 설정',
    workflow: '워크플로우',
    knowledge: '지식 루프',
    plugins: '플러그인·MCP',
    herdr: 'Herdr',
    keymaps: '키맵',
  },
  about: 'Tak(진형탁)',
  links: footerLinks('이력서', RESUME_HREF.ko, '사이트 소스'),
  codeLicense: '코드: MIT',
  contentLicense: '문서: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  localized(HOME_COPY, locale);
