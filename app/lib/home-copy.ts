import { localized } from './i18n';
import { GITHUB_URL, LINKEDIN_URL } from './shared';

/** A footer link, drawn as its icon; `name` is its accessible name and tooltip. */
export interface HomeLink {
  readonly icon: 'linkedin' | 'github' | 'source';
  readonly name: string;
  readonly href: string;
}

/**
 * One turn of the agent in the home's Claude Code session.
 * `say` is a line the agent printed; `tool` is a call (`Skill(ship)`) and the lines under it.
 */
export type HomeSessionLine =
  | { readonly kind: 'say'; readonly text: string }
  | { readonly kind: 'tool'; readonly call: string; readonly result: readonly string[] };

export interface HomeCopy {
  readonly documentTitle: string;
  readonly description: string;
  /** The person's name: the page's h1 and the site name in llms.txt. */
  readonly name: string;
  readonly lede: string;
  /** The terminal: its name for screen readers, the request typed into Claude Code, and the session's lines (an illustrative /orch run, not a transcript). */
  readonly terminalLabel: string;
  readonly request: string;
  readonly session: readonly HomeSessionLine[];
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

const footerLinks = (source: string): HomeLink[] => [
  { icon: 'linkedin', name: 'LinkedIn', href: LINKEDIN_URL },
  { icon: 'github', name: 'GitHub', href: GITHUB_URL },
  { icon: 'source', name: source, href: `${GITHUB_URL}/tak-bro.github.io` },
];

const en: HomeCopy = {
  documentTitle: 'Tak (Hyungtak Jin) — coding-agent harnesses',
  description:
    'How I build coding-agent harnesses and work with them: setup guides by Tak (Hyungtak Jin).',
  name: 'Tak',
  lede: 'A developer into building software with AI agents.',
  terminalLabel: 'Claude Code session',
  request: '/orch refresh the token on its own so an expired one never logs me out',
  session: [
    { kind: 'say', text: 'orch: add · M · done: an expired token never forces a new login' },
    { kind: 'tool', call: "User answered Claude's questions:", result: ['· If the refresh fails → back to the login screen', '· Parallel requests → wait on one refresh'] },
    { kind: 'tool', call: 'Skill(01-plan)', result: ['3 slices · contract 6 rows, red before any code'] },
    { kind: 'tool', call: 'Skill(03-review) slice 02', result: ['FAIL → PASS · one fix for a race'] },
    { kind: 'tool', call: 'Bash(verify-check.sh --all)', result: ['6/6 green'] },
    { kind: 'tool', call: 'Skill(ship)', result: ['committed → draft PR'] },
  ],
  links: footerLinks('Site source'),
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  documentTitle: 'Tak(진형탁) — 코딩 에이전트 하네스',
  description: 'Tak(진형탁)이 코딩 에이전트 하네스를 만들고 쓰는 법을 정리한 셋업 가이드예요.',
  name: 'Tak',
  lede: 'AI 에이전트와 함께 개발하는 데 관심 많은 개발자예요.',
  terminalLabel: 'Claude Code 세션',
  request: '/orch 토큰 만료돼도 로그아웃되지 않게 자동 갱신 붙여줘',
  session: [
    { kind: 'say', text: 'orch: add · M · 완료: 만료 토큰으로도 다시 로그인하지 않음' },
    { kind: 'tool', call: "User answered Claude's questions:", result: ['· 갱신이 실패하면 → 로그인 화면으로', '· 동시 요청 → 갱신 한 번만 기다리게'] },
    { kind: 'tool', call: 'Skill(01-plan)', result: ['슬라이스 3개 · 계약 6행, 구현 전 red 확인'] },
    { kind: 'tool', call: 'Skill(03-review) slice 02', result: ['FAIL → PASS · 경합 fix 1회'] },
    { kind: 'tool', call: 'Bash(verify-check.sh --all)', result: ['6/6 green'] },
    { kind: 'tool', call: 'Skill(ship)', result: ['committed → draft PR'] },
  ],
  links: footerLinks('사이트 소스'),
  codeLicense: '코드: MIT',
  contentLicense: '문서: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  localized(HOME_COPY, locale);
