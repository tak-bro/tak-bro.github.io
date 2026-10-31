import { i18n } from './i18n';
import { GITHUB_URL, LINKEDIN_URL, RESUME_HREF } from './shared';

/** One guide in the list: `slug` is the top-level page under content/docs. */
export interface HomeGuide {
  readonly slug: string;
  readonly title: string;
  readonly blurb: string;
}

/** One fact a recruiter scans for next to the headline. */
export interface HomeProfileItem {
  readonly term: string;
  readonly detail: string;
  readonly href?: string;
}

/**
 * One question a hiring lead would ask, the answer, and the real output behind it.
 * `guide` is the docs slug that goes deeper; `source` names the file or command the output comes from.
 */
export interface HomeEvidence {
  readonly question: string;
  readonly claim: string;
  readonly body: string;
  readonly source: string;
  readonly output: readonly string[];
  readonly guide: string;
  readonly guideLabel: string;
}

/** One practice a team can take over as it is. */
export interface HomeTeamItem {
  readonly title: string;
  readonly body: string;
}

/** One layer of enforcement, strongest first. */
export interface HomeLayer {
  readonly name: string;
  readonly body: string;
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
  readonly role: string;
  readonly headline: string;
  readonly lede: string;
  readonly primaryCta: string;
  readonly profileLabel: string;
  readonly profile: readonly HomeProfileItem[];
  readonly evidenceHeading: string;
  readonly evidenceLede: string;
  readonly evidence: readonly HomeEvidence[];
  readonly teamHeading: string;
  readonly team: readonly HomeTeamItem[];
  readonly ladderHeading: string;
  readonly ladderLede: string;
  readonly ladder: readonly HomeLayer[];
  readonly principlesLink: string;
  readonly guidesHeading: string;
  readonly guidesLede: string;
  readonly guides: readonly HomeGuide[];
  readonly contactHeading: string;
  readonly contactBody: string;
  readonly about: string;
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

// The commit hooks/commit-convention.py actually blocked, and the one that went in after the fix.
const hookSession = (blocked: string, line: string) => [
  '$ git commit -m "feat(site): refocus the site on the guides…"',
  `[commit-convention] ${blocked}`,
  `  ${line}: Co-Authored-By: Claude …`,
  '$ git commit -m "feat(site): refocus the site on the guides…"',
  'c53c335 feat(site): refocus the site on the guides and add a principles guide',
];

const orchSession = (request: string, stop: string) => [
  `> /orch ${request}`,
  `orch: add · M · check: \`pnpm test\` · ${stop}: pr`,
  '03-review · s01  pnpm test → passed · PASS',
  '03-review · s02  pnpm test → passed · PASS',
  '$ gh pr create --draft',
  'feat(blog): filter posts by tag',
  'Auto-decided:',
  '- filter is client state',
];

// content/docs/agent-config: one shared rule file, and the hooks each harness runs.
const harnessTable = (rules: string, summary: string, hooks: string) => [
  `RULES.md  ${rules}`,
  'Claude Code  CLAUDE.md         @RULES.md',
  'opencode     opencode.json     "instructions": ["…/RULES.md"]',
  `pi           APPEND_SYSTEM.md  ${summary}`,
  '',
  `hooks  ${hooks}`,
  'Claude Code  settings.json     commit-convention.py → exit 2',
  'opencode     plugin            some of the same scripts → exit 2',
  'pi           extension         copies of the hooks',
];

const GUIDE_SLUGS = ['principles', 'agent-config', 'workflow', 'plugins', 'herdr', 'keymaps'] as const;

const guides = (lines: Record<(typeof GUIDE_SLUGS)[number], readonly [string, string]>): HomeGuide[] =>
  GUIDE_SLUGS.map((slug) => ({ slug, title: lines[slug][0], blurb: lines[slug][1] }));

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Tak (Hyungtak Jin) — AI and DX engineer',
  description:
    'Agent-written code a team can trust. Portfolio of Tak (Hyungtak Jin), an AI and DX engineer who enforces the rules for coding agents with hooks, gates and draft PRs.',
  name: 'Tak (Hyungtak Jin)',
  role: 'AI and DX engineer',
  headline: 'Agent-written code a team can trust',
  lede: 'The rules I give coding agents are not requests: hooks, gates and draft PRs enforce them. Building web, React Native and Electron apps since 2018.',
  primaryCta: 'Resume',
  profileLabel: 'Profile',
  profile: [
    { term: 'Experience', detail: 'Web, React Native and Electron since 2018' },
    { term: 'Position', detail: 'AI and DX: agent adoption, dev environment, workflow' },
    { term: 'Harnesses', detail: 'Claude Code, opencode and pi' },
    { term: 'Built', detail: 'hwip, agent questions on the phone', href: 'https://hwip.app' },
  ],
  evidenceHeading: 'Three things you would ask',
  evidenceLede: 'Each answer comes with the real config or output.',
  evidence: [
    {
      question: 'What if an agent breaks a rule?',
      claim: 'A hook blocks the commit.',
      body: 'A commit in the wrong format, or with an AI co-author line, ends with exit 2 before it runs. Only the fixed commit goes in.',
      source: 'hooks/commit-convention.py',
      output: hookSession('commit blocked — AI co-author trailer', 'line'),
      guide: 'agent-config',
      guideLabel: 'The hooks',
    },
    {
      question: 'Won’t unreviewed code pile up?',
      claim: 'It stops at a draft PR. I merge.',
      body: 'Each slice needs green tests and a fresh reviewer’s PASS before it is committed. The end is a draft PR; marking it ready and merging are a person’s call.',
      source: '/orch → draft PR',
      output: orchSession('add a tag filter to the blog', 'stop'),
      guide: 'workflow',
      guideLabel: 'The workflow',
    },
    {
      question: 'Doesn’t it stay a personal setup?',
      claim: 'Rules live in one place. Three harnesses follow them.',
      body: 'The shared rules are one file. Claude Code imports it, opencode reads it through instructions, and pi keeps a summary. Hooks block what must not happen: opencode runs some of the same scripts, pi runs copies.',
      source: 'RULES.md',
      output: harnessTable('one file of shared rules', 'a summary of the same rules', 'what gets blocked'),
      guide: 'agent-config',
      guideLabel: 'Agent config',
    },
  ],
  teamHeading: 'What a team can take over',
  team: [
    {
      title: 'One source of rules',
      body: 'Keep the team’s rules in one file in the repo and point every tool at it. Swap the agent and the rules stay.',
    },
    {
      title: 'Hooks for what must hold',
      body: 'When review keeps flagging the same thing, stop writing it down and block it before the commit.',
    },
    {
      title: 'Agents stop at a draft PR',
      body: 'Make a draft PR the end of agent work. People mark it ready and merge, so the review flow the team has stays as it is.',
    },
  ],
  ladderHeading: 'Six layers of enforcement',
  ladderLede: 'The higher the layer, the harder to break. What must hold moves up.',
  ladder: [
    { name: 'No permission', body: 'Explorers have no Edit or Write.' },
    { name: 'Hard block', body: 'Editing the rule files needs my approval.' },
    { name: 'Hook', body: 'Bad commands and commits exit 2.' },
    { name: 'Gate', body: 'Tests green and a fresh reviewer’s PASS.' },
    { name: 'Isolation', body: 'State reinjected; reviews in a fork.' },
    { name: 'Request', body: 'CLAUDE.md. If it must hold, move it up.' },
  ],
  principlesLink: 'All principles',
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
  contactHeading: 'For hiring, message me on LinkedIn.',
  contactBody: 'Experience and projects are in the resume.',
  about: 'Tak (Hyungtak Jin), AI and DX engineer',
  links: [
    { name: 'LinkedIn', href: LINKEDIN_URL },
    { name: 'GitHub', href: GITHUB_URL },
    { name: 'hwip', href: 'https://hwip.app' },
    { name: 'Resume', href: RESUME_HREF.en },
    { name: 'Site source', href: `${GITHUB_URL}/tak-bro.github.io` },
  ],
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Tak(진형탁) — AI·DX 엔지니어',
  description:
    '에이전트가 쓴 코드도 팀이 믿을 수 있게. 코딩 에이전트의 규칙을 훅·게이트·draft PR 로 강제하는 AI·DX 엔지니어 Tak(진형탁)의 포트폴리오.',
  name: 'Tak(진형탁)',
  role: 'AI·DX 엔지니어',
  headline: '에이전트가 쓴 코드도 팀이 믿을 수 있게',
  lede: '코딩 에이전트에게 주는 규칙을 부탁으로 두지 않는다. 훅·게이트·draft PR 로 강제한다. 2018년부터 웹·React Native·Electron 을 만들어 왔다.',
  primaryCta: '이력서',
  profileLabel: '프로필',
  profile: [
    { term: '경력', detail: '2018년부터 웹·React Native·Electron' },
    { term: '포지션', detail: 'AI·DX: 에이전트 도입, 개발 환경, 워크플로우' },
    { term: '쓰는 하네스', detail: 'Claude Code, opencode, pi' },
    { term: '만든 것', detail: 'hwip, 에이전트 질문을 폰으로 받아 답하는 앱', href: 'https://hwip.app' },
  ],
  evidenceHeading: '물어볼 만한 것 세 가지',
  evidenceLede: '답마다 실제 설정과 출력을 붙였다.',
  evidence: [
    {
      question: '에이전트가 규칙을 어기면?',
      claim: '훅이 커밋을 막는다.',
      body: '형식이 틀리거나 AI 공동 저자 줄이 붙은 커밋은 실행 전에 exit 2 로 끝난다. 고친 커밋만 들어간다.',
      source: 'hooks/commit-convention.py',
      output: hookSession('커밋 차단 — AI co-author 트레일러', '줄'),
      guide: 'agent-config',
      guideLabel: '훅 목록',
    },
    {
      question: '리뷰 안 된 코드가 쏟아지지 않나?',
      claim: 'draft PR 에서 멈춘다. 머지는 내가 한다.',
      body: '슬라이스마다 테스트와 새 리뷰어의 PASS 를 지나야 커밋된다. 끝은 draft PR 이고, ready 와 머지는 사람이 한다.',
      source: '/orch → draft PR',
      output: orchSession('블로그에 태그 필터 추가', '멈춤'),
      guide: 'workflow',
      guideLabel: '워크플로우',
    },
    {
      question: '개인 셋업으로 끝나지 않나?',
      claim: '규칙은 한 곳에 두고, 세 하네스가 따른다.',
      body: '공유 규칙은 파일 하나다. Claude Code 는 import 하고, opencode 는 instructions 로 읽고, pi 는 요약을 둔다. 막아야 할 것은 훅으로 막는다. opencode 는 같은 훅 스크립트 일부를, pi 는 훅 사본을 돌린다.',
      source: 'RULES.md',
      output: harnessTable('공유 규칙 한 곳', '같은 규칙의 요약', '막는 것'),
      guide: 'agent-config',
      guideLabel: '에이전트 설정',
    },
  ],
  teamHeading: '팀에 그대로 옮길 수 있는 것',
  team: [
    {
      title: '규칙 정본 하나',
      body: '팀 규칙을 레포의 파일 하나에 두고 도구마다 그 파일을 읽게 한다. 에이전트를 바꿔도 규칙은 그대로다.',
    },
    {
      title: '꼭 지킬 것은 훅으로',
      body: '리뷰에서 같은 지적이 반복되면 문서에 더 쓰지 않고 커밋 전에 막는다.',
    },
    {
      title: '에이전트는 draft PR 까지',
      body: '에이전트 작업의 끝을 draft PR 로 정한다. ready 와 머지는 사람이 하니 팀의 리뷰 흐름은 그대로 남는다.',
    },
  ],
  ladderHeading: '강제는 여섯 층',
  ladderLede: '위로 갈수록 어길 수 없다. 꼭 지킬 것은 위로 올린다.',
  ladder: [
    { name: '권한 없음', body: '탐색 에이전트엔 Edit·Write 가 없다.' },
    { name: '하드 차단', body: '규칙 파일 편집은 내 승인을 거친다.' },
    { name: '훅', body: '위험한 명령과 틀린 커밋은 exit 2.' },
    { name: '게이트', body: '테스트 green, 새 리뷰어의 PASS.' },
    { name: '격리', body: '상태는 다시 주입, 리뷰는 fork 에서.' },
    { name: '부탁', body: 'CLAUDE.md. 꼭 지킬 건 위로 올린다.' },
  ],
  principlesLink: '원칙 전체',
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
  contactHeading: '채용 이야기는 LinkedIn 으로.',
  contactBody: '경력과 프로젝트는 이력서에 있다.',
  about: 'Tak(진형탁), AI·DX 엔지니어',
  links: [
    { name: 'LinkedIn', href: LINKEDIN_URL },
    { name: 'GitHub', href: GITHUB_URL },
    { name: 'hwip', href: 'https://hwip.app' },
    { name: '이력서', href: RESUME_HREF.ko },
    { name: '사이트 소스', href: `${GITHUB_URL}/tak-bro.github.io` },
  ],
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
