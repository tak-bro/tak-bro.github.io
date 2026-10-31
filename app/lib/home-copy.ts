import { i18n } from './i18n';

/** One guide card: `slug` is the top-level page under content/docs. */
export interface HomeGuide {
  readonly slug: string;
  readonly title: string;
  readonly blurb: string;
}

/** One harness or tool in the hero, with the part it plays in the setup. */
export interface HomeTool {
  readonly name: string;
  readonly role: string;
}

/** A push on the phone: the session it came from, the question and its buttons. */
export interface HomePhone {
  readonly app: string;
  readonly question: string;
  readonly actions: readonly string[];
}

/** One way of working: a command or tool, one line, and the terminal or phone fragment that shows it. */
export interface HomeWork {
  readonly name: string;
  readonly line: string;
  readonly session: readonly string[];
  readonly phone?: HomePhone;
}

/** One layer of enforcement, strongest first; `example` is the real file or output behind it. */
export interface HomeLayer {
  readonly name: string;
  readonly body: string;
  readonly source: string;
  readonly example: readonly string[];
}

export interface HomeLink {
  readonly name: string;
  readonly href: string;
}

/** The herdr screen recording: a heading, one line under it, and the video's accessible name. */
export interface HomeDemo {
  readonly heading: string;
  readonly line: string;
  readonly label: string;
  readonly guideLink: string;
}

export interface HomeCopy {
  /** The site name, for llms.txt. */
  readonly title: string;
  readonly documentTitle: string;
  readonly description: string;
  readonly headline: string;
  readonly lede: string;
  readonly tools: readonly HomeTool[];
  readonly primaryCta: string;
  readonly heroSession: readonly string[];
  readonly heroCaption: string;
  readonly workHeading: string;
  readonly work: readonly HomeWork[];
  readonly demo: HomeDemo;
  readonly layersHeading: string;
  readonly layersLede: string;
  readonly layers: readonly HomeLayer[];
  readonly principlesLink: string;
  readonly guidesHeading: string;
  readonly guides: readonly HomeGuide[];
  readonly about: string;
  readonly links: readonly HomeLink[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

const GITHUB = 'https://github.com/tak-bro';

const hookSession = (blocked: string, line: string) => [
  '$ git commit -m "feat(site): refocus the site on the guides…"',
  `[commit-convention] ${blocked}`,
  `  ${line}: Co-Authored-By: Claude …`,
  '$ git commit -m "feat(site): refocus the site on the guides…"',
  'c53c335 feat(site): refocus the site on the guides and add a principles guide',
];
const HOOK_SESSION_EN = hookSession('commit blocked — AI co-author trailer', 'line');
const HOOK_SESSION_KO = hookSession('커밋 차단 — AI co-author 트레일러', '줄');

const EXPLORER_AGENT = ['agents/explorer.md', '---', 'name: explorer', 'model: sonnet', 'tools: Read, Bash', '---'];
const SETTINGS_ASK = ['settings.json', '"ask": [', '  "Edit(**/CLAUDE.md)",', '  "Edit(**/RULES.md)",', '  "Edit(**/CONTEXT.md)",', '  "Edit(**/AGENTS.md)",'];
const GATE = ['03-review · slice s01', 'verify: pnpm test → passed', 'review: PASS', '- [x] s01'];
const SESSION_START = ['SessionStart:compact', '--- 최근 커밋 ---', 'c53c335 feat(site): refocus the site on the guides…', '--- 브랜치 ---', 'feat/ui-refresh'];
const TEAM = ['> /team', 'worker-1  claude    blog-tags', 'worker-2  pi        rss-fix', 'worker-3  opencode  tests'];
const DRAFT_PR = ['$ gh pr create --draft', 'feat(blog): filter posts by tag', 'Auto-decided:', '- filter is client state'];

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Coding agents, run on structure — Tak',
  description: 'The coding agent setup of Tak (Hyungtak Jin): Claude Code, pi and opencode on one config, answered from the phone with hwip.',
  headline: 'Coding agents, run on structure',
  lede: 'The setup of Tak, a frontend engineer. Claude Code, pi and opencode on one config, answered from the phone with hwip.',
  tools: [
    { name: 'Claude Code', role: 'full set' },
    { name: 'pi', role: 'shared skills' },
    { name: 'opencode', role: 'same hooks' },
    { name: 'herdr', role: 'panes' },
    { name: 'hwip', role: 'phone' },
  ],
  primaryCta: 'See the setup',
  heroSession: HOOK_SESSION_EN,
  heroCaption: 'A commit a hook actually blocked.',
  workHeading: 'How I work',
  work: [
    { name: '/orch', line: 'One line in, a draft PR out.', session: ['> /orch add a tag filter to the blog', 'orch: add · M · check: `pnpm test` · stop: pr'] },
    {
      name: 'hwip',
      line: 'Questions reach my phone. One tap and it goes on.',
      session: [],
      phone: { app: 'Claude Code', question: 'Keep year groups in this PR?', actions: ['Keep', 'Next PR'] },
    },
    { name: '/team', line: 'Three workers side by side in herdr.', session: TEAM },
    { name: 'draft PR', line: 'It stops here. I merge.', session: DRAFT_PR },
  ],
  demo: {
    heading: 'Three agents, one screen',
    line: 'Claude Code, opencode and pi in herdr. The sidebar shows who is working and who needs me; the keys are along the bottom.',
    label: 'Screen recording of herdr: splitting panes, starting Claude Code, opencode and pi, switching projects, zooming a pane and hiding the sidebar.',
    guideLink: 'Herdr guide',
  },
  layersHeading: 'Rules as structure, not requests',
  layersLede: 'The higher the layer, the harder to break.',
  layers: [
    { name: 'No permission', body: 'Explorers have no Edit or Write.', source: 'agents/explorer.md', example: EXPLORER_AGENT },
    { name: 'Hard block', body: 'Editing the rule files needs my approval.', source: 'settings.json', example: SETTINGS_ASK },
    { name: 'Hook', body: 'Bad commands and commits exit 2.', source: 'hooks/commit-convention.py', example: HOOK_SESSION_EN },
    { name: 'Gate', body: 'Tests green and a fresh reviewer’s PASS.', source: '03-review', example: GATE },
    { name: 'Isolation', body: 'State reinjected; reviews in a fork.', source: 'SessionStart hook', example: SESSION_START },
    { name: 'Request', body: 'CLAUDE.md. If it must hold, move it up.', source: 'RULES.md', example: ['RULES.md', '- First sentence = the conclusion.', '- No unrequested recap.'] },
  ],
  principlesLink: 'All principles',
  guidesHeading: 'Setup guides',
  guides: [
    { slug: 'principles', title: 'Principles', blurb: 'Why the setup looks the way it does.' },
    { slug: 'agent-config', title: 'Agent config', blurb: 'Rules, hooks and subagents for three harnesses.' },
    { slug: 'workflow', title: 'Workflow', blurb: 'From one line to a merged PR.' },
    { slug: 'plugins', title: 'Plugins and MCP', blurb: 'What stays on, and why.' },
    { slug: 'herdr', title: 'Herdr', blurb: 'The terminal workspace and its keys.' },
    { slug: 'keymaps', title: 'Keymaps', blurb: 'macOS, Ghostty, Karabiner, LazyVim.' },
    { slug: 'setup', title: 'Mac setup', blurb: 'A new Mac, in order.' },
  ],
  about: 'Tak · Hyungtak Jin · web, React Native and Electron since 2018',
  links: [
    { name: 'GitHub', href: GITHUB },
    { name: 'hwip', href: 'https://hwip.app' },
    { name: 'Resume', href: '/assets/resume_eng.pdf' },
    { name: 'Site source', href: `${GITHUB}/tak-bro.github.io` },
  ],
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  title: 'Tak',
  documentTitle: '코딩 에이전트를 구조로 굴린다 — Tak',
  description: 'Tak(진형탁)의 코딩 에이전트 셋업. Claude Code·pi·opencode 를 설정 하나로 묶고, 폰에서는 hwip 으로 답한다.',
  headline: '코딩 에이전트를 구조로 굴린다',
  lede: '프론트엔드 개발자 Tak 의 셋업. Claude Code·pi·opencode 를 설정 하나로 묶고, 폰에서는 hwip 으로 답한다.',
  tools: [
    { name: 'Claude Code', role: '전체 세트' },
    { name: 'pi', role: '공유 스킬' },
    { name: 'opencode', role: '같은 훅' },
    { name: 'herdr', role: 'pane' },
    { name: 'hwip', role: '폰' },
  ],
  primaryCta: '셋업 보기',
  heroSession: HOOK_SESSION_KO,
  heroCaption: '훅이 실제로 막은 커밋.',
  workHeading: '이렇게 쓴다',
  work: [
    { name: '/orch', line: '한 줄로 맡기면 draft PR 까지 간다.', session: ['> /orch 블로그에 태그 필터 추가', 'orch: add · M · check: `pnpm test` · 멈춤: pr'] },
    {
      name: 'hwip',
      line: '판단할 일은 폰으로 온다. 탭 한 번이면 이어진다.',
      session: [],
      phone: { app: 'Claude Code', question: '연도 묶음도 이번 PR 에 둘까?', actions: ['둔다', '다음 PR'] },
    },
    { name: '/team', line: '워커 셋이 herdr 에서 동시에 일한다.', session: TEAM },
    { name: 'draft PR', line: '여기서 멈춘다. 머지는 내가 한다.', session: DRAFT_PR },
  ],
  demo: {
    heading: '에이전트 셋, 한 화면',
    line: 'herdr 안에서 Claude Code·opencode·pi 를 같이 굴린다. 사이드바가 누가 일하고 누가 나를 기다리는지 보여 준다. 누른 키는 화면 아래에.',
    label: 'herdr 화면 녹화: pane 을 나누고 Claude Code·opencode·pi 를 띄운 뒤, 프로젝트를 오가고 pane 을 확대하고 사이드바를 접는다.',
    guideLink: 'Herdr 가이드',
  },
  layersHeading: '규칙은 부탁 말고 구조로',
  layersLede: '위로 갈수록 어길 수 없다.',
  layers: [
    { name: '권한 없음', body: '탐색 에이전트엔 Edit·Write 가 없다.', source: 'agents/explorer.md', example: EXPLORER_AGENT },
    { name: '하드 차단', body: '규칙 파일 편집은 내 승인을 거친다.', source: 'settings.json', example: SETTINGS_ASK },
    { name: '훅', body: '위험한 명령과 틀린 커밋은 exit 2.', source: 'hooks/commit-convention.py', example: HOOK_SESSION_KO },
    { name: '게이트', body: '테스트 green, 새 리뷰어의 PASS.', source: '03-review', example: GATE },
    { name: '격리', body: '상태는 다시 주입, 리뷰는 fork 에서.', source: 'SessionStart 훅', example: SESSION_START },
    { name: '부탁', body: 'CLAUDE.md. 꼭 지킬 건 위로 올린다.', source: 'RULES.md', example: ['RULES.md', '- 첫 문장 = 결론.', '- 요청 안 한 요약 금지.'] },
  ],
  principlesLink: '원칙 전체',
  guidesHeading: '셋업 가이드',
  guides: [
    { slug: 'principles', title: '원칙', blurb: '셋업이 이렇게 생긴 이유.' },
    { slug: 'agent-config', title: '에이전트 설정', blurb: '세 하네스의 규칙, 훅, 서브에이전트.' },
    { slug: 'workflow', title: '워크플로우', blurb: '한 줄에서 머지까지.' },
    { slug: 'plugins', title: '플러그인·MCP', blurb: '켜 두는 것과 그 이유.' },
    { slug: 'herdr', title: 'Herdr', blurb: '터미널 작업 공간과 단축키.' },
    { slug: 'keymaps', title: '키맵', blurb: 'macOS, Ghostty, Karabiner, LazyVim.' },
    { slug: 'setup', title: '맥 셋업', blurb: '새 맥을 세팅하는 순서.' },
  ],
  about: 'Tak · 진형탁 · 2018년부터 웹, React Native, Electron',
  links: [
    { name: 'GitHub', href: GITHUB },
    { name: 'hwip', href: 'https://hwip.app' },
    { name: '이력서', href: '/assets/resume.pdf' },
    { name: '사이트 소스', href: `${GITHUB}/tak-bro.github.io` },
  ],
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
