import { i18n } from './i18n';

export type HomeGuideGroupId = 'agents' | 'machine';

/** One guide row: `slug` is the top-level page under content/docs. */
export interface HomeGuide {
  readonly slug: string;
  readonly group: HomeGuideGroupId;
  readonly title: string;
  readonly blurb: string;
}

export interface HomeGuideGroup {
  readonly id: HomeGuideGroupId;
  readonly heading: string;
}

/** One harness or tool in the hero, with the part it plays in the setup. */
export interface HomeTool {
  readonly name: string;
  readonly role: string;
}

/** One layer of enforcement, strongest first; `example` is the real file or output that shows it. */
export interface HomeLayer {
  readonly name: string;
  readonly body: string;
  readonly source: string;
  readonly example: readonly string[];
}

/** A push on the phone: the question an agent asks and the buttons it offers. */
export interface HomePhone {
  readonly app: string;
  readonly question: string;
  readonly actions: readonly string[];
}

/** One scene of a working day; it shows a terminal session or, with `phone`, a push. */
export interface HomeScene {
  readonly statement: string;
  readonly body: string;
  readonly session: readonly string[];
  readonly phone?: HomePhone;
}

export interface HomePrinciple {
  readonly title: string;
  readonly body: string;
}

export interface HomeFact {
  readonly label: string;
  readonly value: string;
}

/** A row in the about lists; `href` is a guide slug when `guide` is set, else a URL. */
export interface HomeRecord {
  readonly name: string;
  readonly value: string;
  readonly href: string;
  readonly guide?: boolean;
}

export interface HomeRecordGroup {
  readonly word: string;
  readonly records: readonly HomeRecord[];
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
  readonly allGuides: string;
  readonly heroSession: readonly string[];
  readonly heroCaption: string;
  readonly layersHeading: string;
  readonly layersIntro: string;
  readonly layersStrong: string;
  readonly layersWeak: string;
  readonly layers: readonly HomeLayer[];
  readonly scenesHeading: string;
  readonly scenes: readonly HomeScene[];
  readonly principlesHeading: string;
  readonly principles: readonly HomePrinciple[];
  readonly principlesLink: string;
  readonly tryHeading: string;
  readonly tryIntro: string;
  readonly trySteps: readonly string[];
  readonly guidesHeading: string;
  readonly guideGroups: readonly HomeGuideGroup[];
  readonly guides: readonly HomeGuide[];
  readonly aboutHeading: string;
  readonly facts: readonly HomeFact[];
  readonly bio: string;
  readonly recordGroups: readonly HomeRecordGroup[];
  readonly footerWhat: string;
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly skipLabel: string;
}

const SITE_SOURCE = 'https://github.com/tak-bro/tak-bro.github.io';
const HWIP_URL = 'https://hwip.app';
const STATUSLINE_URL = 'https://github.com/tak-bro/tak-cc-statusline';

/** The commit a hook stopped while this page was being built. */
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

const SETTINGS_ASK = [
  'settings.json',
  '"ask": [',
  '  "Edit(**/CLAUDE.md)",',
  '  "Edit(**/RULES.md)",',
  '  "Edit(**/CONTEXT.md)",',
  '  "Edit(**/AGENTS.md)",',
];

const SESSION_START = ['SessionStart:compact', '=== 세션 컨텍스트 ===', '--- 최근 커밋 ---', 'dfa1e75 feat(home): rebuild the home as a docs landing page', '--- 브랜치 ---', 'feat/ui-refresh'];

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Structure, not requests — Tak',
  description:
    'Hyungtak Jin, frontend engineer. One setup for Claude Code, pi and opencode, answered from the phone through hwip, with rules kept as hooks and gates instead of sentences.',
  headline: 'Structure, not requests',
  lede: 'I’m Hyungtak Jin, a frontend engineer. I run Claude Code, pi and opencode from one setup, answer them from my phone with hwip, which I build, and keep the rules as hooks and gates instead of sentences.',
  tools: [
    { name: 'Claude Code', role: 'the full set' },
    { name: 'pi', role: 'shared skills' },
    { name: 'opencode', role: 'the same guard hooks' },
    { name: 'herdr', role: 'worker panes' },
    { name: 'hwip', role: 'answers from the phone' },
  ],
  primaryCta: 'Read the principles',
  allGuides: 'All guides',
  heroSession: HOOK_SESSION_EN,
  heroCaption: 'A rule asks; a hook blocks. A hook stopped this commit while this page was being built.',
  layersHeading: 'The strongest layer first',
  layersIntro:
    '“Never do this” is forgotten once the context grows long; structure is not. The higher the layer, the less it can be broken, so a rule moves up when it keeps being broken.',
  layersStrong: 'cannot be broken',
  layersWeak: 'only asks',
  layers: [
    { name: 'No permission', body: 'The explorer agent has no Edit or Write tool at all.', source: 'agents/explorer.md', example: EXPLORER_AGENT },
    { name: 'Hard block', body: 'Editing the files that steer the agents needs my approval.', source: 'settings.json', example: SETTINGS_ASK },
    { name: 'Hook, exit 2', body: 'Dangerous commands, force pushes to protected branches, AI co-author trailers and malformed commits stop here.', source: 'hooks/commit-convention.py', example: HOOK_SESSION_EN },
    {
      name: 'Gate',
      body: 'A slice passes when its tests are green and a reviewer that never saw the conversation says PASS.',
      source: '03-review',
      example: ['03-review · slice s01', 'finder: new subagent, plan and diff only', 'verify: pnpm test → passed', '- [x] s01', '- AC-1 · status: PASS · evidence: `pnpm test` → passed'],
    },
    { name: 'Injection and isolation', body: 'A hook puts the commits and the branch back after every compact; reviews run in a separate context.', source: 'hooks · SessionStart', example: SESSION_START },
    {
      name: 'Request',
      body: 'CLAUDE.md is guidance. When a line in it has to hold, it moves up a layer.',
      source: 'RULES.md',
      example: ['RULES.md', '## Chat Response Rules', '- First sentence = the conclusion. The reasons follow.', '- No summary or recap that was not asked for.'],
    },
  ],
  scenesHeading: 'How a day goes',
  scenes: [
    {
      statement: 'One line hands over the task.',
      body: '/orch declares the kind, the size, what done means and the command that measures it, then carries the task to a draft PR.',
      session: ['> /orch add a tag filter to the blog list', 'orch: add · M · 4 files · done: picking a tag leaves only its posts · check: `pnpm test` · stop: pr'],
    },
    {
      statement: 'When it needs a call, the phone buzzes.',
      body: 'hwip pushes the question to my phone. A tap on a button goes straight back into the live session, so it keeps going while I am away from the desk.',
      session: [],
      phone: { app: 'Claude Code · feat/blog-tags', question: 'Slice s02 adds year groups too. Keep it in this PR?', actions: ['Keep it', 'Next PR'] },
    },
    {
      statement: 'Bigger work gets a team.',
      body: '/team makes the session the lead and starts Claude, pi and opencode workers in herdr panes. The lead merges the larger PRs after a fresh review.',
      session: ['> /team', 'lead: this session', 'worker-1  claude    feat/blog-tags', 'worker-2  pi        fix/rss-dates', 'worker-3  opencode  lens: tests'],
    },
    {
      statement: 'Everything stops at a draft PR.',
      body: 'Choices made without asking go into the PR body. Design and scope are mine to judge there, and the merge is mine too.',
      session: ['$ gh pr create --draft', 'feat(blog): group posts by year and filter by tag', 'Auto-decided:', '- The filter is client state, not the URL.'],
    },
  ],
  principlesHeading: 'What the setup is built on',
  principles: [
    { title: 'One source of truth', body: 'A skill the three harnesses share has one English body; each harness keeps only a table of what differs. With no second copy, nothing has to be kept in sync.' },
    { title: 'Hide the passing bar', body: 'A reviewer told “zero Criticals passes” softens severities until it passes. The gate is read only after the findings are in.' },
    { title: 'Proof, not claims', body: 'A loop ends on tests, lint and type checks. “Looks done” is not a verifier.' },
    { title: 'Context is the scarcest thing', body: 'Reviews run apart from the session that wrote the code; wide reading goes to a subagent that returns only its conclusion.' },
    { title: 'Delete as models improve', body: 'Steps that made up for a weaker model go; deterministic verifiers stay. Before deleting, the logs say whether it still fires.' },
    { title: 'Fix the system, not only the diff', body: 'Fixing only the code means the next run makes the same mistake. The layer that allowed it gets fixed, and every rule records the incident behind it.' },
  ],
  principlesLink: 'Read the principles in full',
  tryHeading: 'Three things to try today',
  tryIntro: 'Each one moves a rule from asking to structure.',
  trySteps: [
    'Take the rule in your CLAUDE.md that is broken most often and turn it into a hook that exits 2.',
    'Remove Edit and Write from the subagent you use for exploring.',
    'Run reviews in a fork or a fresh session, not in the one that wrote the code.',
  ],
  guidesHeading: 'The setup, written down',
  guideGroups: [
    { id: 'agents', heading: 'Coding agents' },
    { id: 'machine', heading: 'Terminal and Mac' },
  ],
  guides: [
    { slug: 'principles', group: 'agents', title: 'Principles', blurb: 'Checkable criteria first, the model fills in only the verdict, and why each rule exists.' },
    { slug: 'agent-config', group: 'agents', title: 'Agent config', blurb: 'Rules, hooks, and subagents for Claude Code, pi, and opencode.' },
    { slug: 'workflow', group: 'agents', title: 'Workflow', blurb: 'How a task goes from plan to merged PR.' },
    { slug: 'plugins', group: 'agents', title: 'Plugins and MCP', blurb: 'The Claude Code plugins and MCP servers I keep on, and why.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: 'Terminal workspace setup and its keyboard shortcuts.' },
    { slug: 'keymaps', group: 'machine', title: 'Keymaps', blurb: 'macOS keyboard defaults, Ghostty keys, Karabiner, and LazyVim.' },
    { slug: 'setup', group: 'machine', title: 'Mac setup', blurb: 'The order I set up a new Mac in.' },
  ],
  aboutHeading: 'Who builds this',
  facts: [
    { label: 'Name', value: 'Hyungtak Jin' },
    { label: 'Work', value: 'Frontend engineer' },
    { label: 'Since', value: '2018, on the web' },
  ],
  bio: 'I started on C++ ultrasound software and have built web, React Native and Electron products since 2018. Now I shape how work is handed to coding agents, and build hwip so I can answer them from my phone.',
  recordGroups: [
    {
      word: 'Built',
      records: [
        { name: 'hwip', value: 'hwip.app', href: HWIP_URL },
        { name: 'tak-cc-statusline', value: 'GitHub', href: STATUSLINE_URL },
        { name: 'Agent config', value: 'Guide', href: 'agent-config', guide: true },
      ],
    },
    {
      word: 'Elsewhere',
      records: [
        { name: 'GitHub', value: 'tak-bro', href: 'https://github.com/tak-bro' },
        { name: 'Resume', value: 'PDF', href: '/assets/resume_eng.pdf' },
        { name: 'Site source', value: 'MIT', href: SITE_SOURCE },
      ],
    },
  ],
  footerWhat: 'Tak, structure over requests',
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  title: 'Tak',
  documentTitle: '부탁하지 않고, 구조로 강제한다 — Tak',
  description:
    '프론트엔드 개발자 진형탁. Claude Code·pi·opencode 를 설정 하나로 묶어 쓰고, 폰에서는 hwip 으로 답하고, 규칙은 문장 대신 훅과 게이트로 둔다.',
  headline: '부탁하지 않고, 구조로 강제한다',
  lede: '프론트엔드 개발자 진형탁이다. Claude Code·pi·opencode 를 설정 하나로 묶어 쓰고, 폰에서는 직접 만든 hwip 으로 답한다. 규칙은 문장 대신 훅과 게이트로 둔다.',
  tools: [
    { name: 'Claude Code', role: '전체 세트' },
    { name: 'pi', role: '공유 스킬' },
    { name: 'opencode', role: '같은 가드 훅' },
    { name: 'herdr', role: '워커 pane' },
    { name: 'hwip', role: '폰에서 답하기' },
  ],
  primaryCta: '원칙 읽기',
  allGuides: '전체 가이드',
  heroSession: HOOK_SESSION_KO,
  heroCaption: '규칙은 부탁하고, 훅은 막는다. 이 페이지를 만드는 동안 훅이 막은 커밋이다.',
  layersHeading: '강제는 센 층부터',
  layersIntro: '"절대 하지 마세요"는 컨텍스트가 길어지면 잊힌다. 구조는 잊히지 않는다. 위층일수록 어길 수 없고, 자꾸 어겨지는 규칙은 한 층 위로 올린다.',
  layersStrong: '어길 수 없다',
  layersWeak: '부탁할 뿐',
  layers: [
    { name: '권한 없음', body: '탐색 에이전트에는 Edit·Write 도구가 아예 없다.', source: 'agents/explorer.md', example: EXPLORER_AGENT },
    { name: '하드 차단', body: '에이전트를 조종하는 파일을 고치려면 내 승인을 거친다.', source: 'settings.json', example: SETTINGS_ASK },
    { name: '훅 exit 2', body: '위험한 명령, 보호 브랜치 force push, AI 공동저자 트레일러, 형식이 틀린 커밋이 여기서 멈춘다.', source: 'hooks/commit-convention.py', example: HOOK_SESSION_KO },
    {
      name: '게이트',
      body: '슬라이스는 테스트가 green 이고, 대화를 본 적 없는 리뷰어가 PASS 를 줘야 통과한다.',
      source: '03-review',
      example: ['03-review · slice s01', 'finder: 새 서브에이전트, 플랜과 diff 만', 'verify: pnpm test → passed', '- [x] s01', '- AC-1 · status: PASS · evidence: `pnpm test` → passed'],
    },
    { name: '주입과 격리', body: 'compact 뒤마다 훅이 커밋과 브랜치를 다시 넣고, 리뷰는 분리된 컨텍스트에서 돈다.', source: 'hooks · SessionStart', example: SESSION_START },
    {
      name: '부탁',
      body: 'CLAUDE.md 는 가이드다. 꼭 지켜져야 하는 줄은 위층으로 올린다.',
      source: 'RULES.md',
      example: ['RULES.md', '## Chat Response Rules', '- 첫 문장 = 결론. 근거는 뒤에.', '- 요청 안 한 요약·recap 금지.'],
    },
  ],
  scenesHeading: '하루는 이렇게 간다',
  scenes: [
    {
      statement: '한 줄로 맡긴다.',
      body: '/orch 가 작업 종류, 크기, 완료 기준과 그것을 재는 명령을 첫 줄에 선언하고 draft PR 까지 잇는다.',
      session: ['> /orch 블로그 목록에 태그 필터 추가', 'orch: add · M · 파일 4개 · 완료: 태그를 고르면 그 태그 글만 남는다 · check: `pnpm test` · 멈춤: pr'],
    },
    {
      statement: '판단이 필요하면 폰이 울린다.',
      body: 'hwip 이 질문을 폰으로 보낸다. 버튼을 누르면 답이 살아 있는 세션으로 바로 들어가서, 자리를 비워도 작업이 이어진다.',
      session: [],
      phone: { app: 'Claude Code · feat/blog-tags', question: '슬라이스 s02 에 연도 묶음도 들어간다. 이번 PR 에 둘까?', actions: ['이번에 둔다', '다음 PR'] },
    },
    {
      statement: '큰 일은 팀을 꾸린다.',
      body: '/team 은 이 세션을 리드로 두고 herdr pane 에 Claude·pi·opencode 워커를 띄운다. 큰 PR 은 리드가 새 리뷰를 거쳐 머지한다.',
      session: ['> /team', 'lead: 이 세션', 'worker-1  claude    feat/blog-tags', 'worker-2  pi        fix/rss-dates', 'worker-3  opencode  lens: tests'],
    },
    {
      statement: '모든 일은 draft PR 에서 멈춘다.',
      body: '묻지 않고 정한 것은 PR 본문에 적는다. 설계와 스코프는 거기서 내가 판단하고, 머지도 내가 한다.',
      session: ['$ gh pr create --draft', 'feat(blog): group posts by year and filter by tag', 'Auto-decided:', '- 필터는 URL 이 아니라 클라이언트 상태다.'],
    },
  ],
  principlesHeading: '설정 밑에 깔린 것',
  principles: [
    { title: '정본은 하나', body: '세 하네스가 같이 쓰는 스킬은 영어 정본 하나이고, 하네스마다 다른 점만 표로 둔다. 두 벌이 없으니 맞출 일도 없다.' },
    { title: '통과선은 숨긴다', body: '"Critical 0 이면 통과"를 아는 리뷰어는 심각도를 깎아 통과를 만든다. 게이트 기준은 파인딩이 끝난 뒤에만 읽는다.' },
    { title: '주장 말고 증명', body: '루프는 테스트·lint·typecheck 로만 끝난다. "된 것 같다"는 verifier 가 아니다.' },
    { title: '컨텍스트가 가장 비싸다', body: '리뷰는 코드를 쓴 세션과 분리해서 돌리고, 넓게 읽는 일은 서브에이전트에게 맡겨 결론만 받는다.' },
    { title: '모델이 좋아지면 지운다', body: '약한 모델을 메우던 절차는 지우고 결정적 verifier 는 남긴다. 지우기 전에 지금도 발화하는지 로그로 본다.' },
    { title: '실수는 시스템에서 고친다', body: '코드만 고치면 다음 런이 같은 실수를 한다. 실수를 허용한 층을 고치고, 규칙마다 생긴 사고와 날짜를 남긴다.' },
  ],
  principlesLink: '원칙 전체 읽기',
  tryHeading: '오늘 해 볼 세 가지',
  tryIntro: '셋 다 규칙 하나를 부탁에서 구조로 옮긴다.',
  trySteps: [
    'CLAUDE.md 에서 가장 자주 어겨지는 규칙 하나를 exit 2 로 끝나는 훅으로 만든다.',
    '탐색에 쓰는 서브에이전트에서 Edit·Write 를 뺀다.',
    '리뷰를 코드를 쓴 세션이 아니라 fork 나 새 세션에서 돌린다.',
  ],
  guidesHeading: '그 설정을 적은 가이드',
  guideGroups: [
    { id: 'agents', heading: '코딩 에이전트' },
    { id: 'machine', heading: '터미널과 맥' },
  ],
  guides: [
    { slug: 'principles', group: 'agents', title: '원칙', blurb: '검증할 수 있는 기준을 먼저 주고 모델은 판정 칸만 채운다. 규칙마다 생긴 이유.' },
    { slug: 'agent-config', group: 'agents', title: '에이전트 설정', blurb: 'Claude Code, pi, opencode 의 규칙, 훅, 서브에이전트.' },
    { slug: 'workflow', group: 'agents', title: '워크플로우', blurb: '작업 하나가 계획에서 머지까지 가는 길.' },
    { slug: 'plugins', group: 'agents', title: '플러그인·MCP', blurb: '켜 두고 쓰는 Claude Code 플러그인과 MCP 서버.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: '터미널 작업 공간 설정과 단축키.' },
    { slug: 'keymaps', group: 'machine', title: '키맵', blurb: 'macOS 키보드 기본값, Ghostty 키, Karabiner, LazyVim.' },
    { slug: 'setup', group: 'machine', title: '맥 셋업', blurb: '새 맥을 세팅하는 순서.' },
  ],
  aboutHeading: '만드는 사람',
  facts: [
    { label: '이름', value: '진형탁' },
    { label: '하는 일', value: '프론트엔드 개발자' },
    { label: '시작', value: '2018년, 웹' },
  ],
  bio: 'C++ 초음파 소프트웨어로 시작해 2018년부터 웹, React Native, Electron 제품을 만들었다. 지금은 코딩 에이전트에게 일을 맡기는 구조를 다듬고, 폰에서 에이전트에게 답하는 hwip 을 만든다.',
  recordGroups: [
    {
      word: '만든 것',
      records: [
        { name: 'hwip', value: 'hwip.app', href: HWIP_URL },
        { name: 'tak-cc-statusline', value: 'GitHub', href: STATUSLINE_URL },
        { name: '에이전트 설정', value: '가이드', href: 'agent-config', guide: true },
      ],
    },
    {
      word: '다른 곳',
      records: [
        { name: 'GitHub', value: 'tak-bro', href: 'https://github.com/tak-bro' },
        { name: '이력서', value: 'PDF', href: '/assets/resume.pdf' },
        { name: '사이트 소스', value: 'MIT', href: SITE_SOURCE },
      ],
    },
  ],
  footerWhat: 'Tak, 부탁 대신 구조',
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  skipLabel: '본문으로 건너뛰기',
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

/** The skip link's target, rendered by the root ahead of the nav. */
export const HOME_CONTENT_ID = 'home-content';

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
