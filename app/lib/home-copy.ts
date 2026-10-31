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

/** One stop of the `/orch` path: the statement on the left, the session it shows on the right. */
export interface HomeStage {
  readonly statement: string;
  readonly body: string;
  readonly session: readonly string[];
}

/** The criteria the hero panel checks against the page itself; the evidence is measured in home.tsx. */
export type HomeCheckId = 'headline' | 'contrast' | 'guides' | 'nav';

export interface HomeCheck {
  readonly id: HomeCheckId;
  readonly claim: string;
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
  readonly primaryCta: string;
  readonly allGuides: string;
  readonly checksTitle: string;
  readonly checksRun: string;
  readonly checksPending: string;
  /** Evidence wording for the measured counts. */
  readonly lineCount: (lines: number) => string;
  readonly pagesExist: string;
  readonly checks: readonly HomeCheck[];
  readonly introHeading: string;
  readonly intro: readonly string[];
  readonly introLink: string;
  readonly hookCaption: string;
  readonly hookSession: readonly string[];
  readonly stagesHeading: string;
  readonly stages: readonly HomeStage[];
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

const en: HomeCopy = {
  title: 'Tak',
  documentTitle: 'Coding agent setup, with its checks — Tak',
  description:
    'How I set up Claude Code, pi and opencode, the workflow I run on them, and the principles under it. Every guide ends with a check you can run.',
  headline: 'Coding agent setup, with its checks',
  lede: 'Config for Claude Code, pi and opencode, the workflow I run on it, and the principles under it. Every guide ends with a check you can run.',
  primaryCta: 'Start with the principles',
  allGuides: 'All guides',
  checksTitle: 'Done criteria for this page',
  checksRun: 'Run the checks',
  checksPending: 'not run',
  lineCount: (lines) => `${lines} ${lines === 1 ? 'line' : 'lines'}`,
  pagesExist: 'pages exist',
  checks: [
    { id: 'headline', claim: 'The headline fits on two lines or fewer.' },
    { id: 'contrast', claim: 'Body text has 4.5:1 contrast or more on its ground.' },
    { id: 'guides', claim: 'Every guide link points to a page that exists.' },
    { id: 'nav', claim: 'The nav has three links, no more.' },
  ],
  introHeading: 'A command instead of “done”',
  intro: [
    'When I hand a task to an agent, the first line states what must be true when it is finished and the command that measures it.',
    'Before implementing, that command has to come back red. Once work starts the criterion is frozen. The model fills in only the verdict, and the evidence is one line of output from a command it really ran.',
    'The reviewer reads the plan and the diff without knowing the passing bar. Design and scope are mine to judge, in the draft PR.',
    'Every rule carries a dated note on why it exists, so the next person can tell whether it is safe to delete.',
  ],
  introLink: 'Read the principles',
  hookCaption: 'A rule asks; a hook blocks. A hook stopped this commit while this page was being built.',
  hookSession: [
    '$ git commit -m "feat(site): refocus the site on the guides…"',
    '[commit-convention] commit blocked — AI co-author trailer',
    '  line: Co-Authored-By: Claude …',
    '  Drop this line from the message and run the same commit again.',
    '$ git commit -m "feat(site): refocus the site on the guides…"',
    'c53c335 feat(site): refocus the site on the guides and add a principles guide',
  ],
  stagesHeading: 'The path of one task',
  stages: [
    {
      statement: 'First, declare what done means.',
      body: 'The first line names the kind of task, its size, the done criterion and the command that measures it. If it is wrong, I fix that line.',
      session: [
        '> /orch add a tag filter to the blog list',
        'orch: add · M · 4 files · done: picking a tag leaves only its posts · check: `pnpm test` · stop: pr',
      ],
    },
    {
      statement: 'Then split it into slices, on file.',
      body: 'Each slice is tied to a check and written to the plan file. If the session drops, the run picks up from the file.',
      session: [
        '.claude/<date>/PLAN-<time>.md',
        '## Slice Queue',
        '- [ ] s01 groupByYear · tagCounts · filterByTag',
        '- [ ] s02 year groups and tag chips on /blog',
        '## Acceptance Contract',
        '- AC-1 · s01 · WHEN a tag is picked THE list SHALL keep only its posts · status: FAIL',
      ],
    },
    {
      statement: 'Each slice meets a fresh reviewer.',
      body: 'A reviewer that has not seen the conversation reads only the plan and the diff. Three failed rounds and it stops to report.',
      session: [
        '03-review · slice s01',
        'finder (new subagent): Critical 0 · Important 1',
        '04-fix → verify green → re-review PASS',
        '- [x] s01 groupByYear · tagCounts · filterByTag',
        '- AC-1 · s01 · status: PASS · evidence: `pnpm test` → passed',
      ],
    },
    {
      statement: 'It stops at a draft PR.',
      body: 'Once the queue is empty the whole branch is reviewed again, and choices made without asking go into the PR body.',
      session: [
        '$ gh pr create --draft',
        'feat(blog): group posts by year and filter by tag',
        'Auto-decided:',
        '- The filter is client state, not the URL: the prerendered list must match on hydration.',
      ],
    },
    {
      statement: 'The merge is mine.',
      body: '/land squash merges, removes the worktree and updates the local main in one go.',
      session: ['> /land', 'squash merge · worktree removed · main up to date'],
    },
  ],
  guidesHeading: 'Guides',
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
  aboutHeading: 'Who writes this',
  facts: [
    { label: 'Name', value: 'Hyungtak Jin' },
    { label: 'Work', value: 'Frontend engineer' },
    { label: 'Since', value: '2018, on the web' },
  ],
  bio: 'I started on C++ ultrasound software and have built web, React Native, and Electron products since 2018. These days I keep refining how I hand work to coding agents, and write down why each change was made.',
  recordGroups: [
    {
      word: 'Tools',
      records: [
        { name: 'Claude Code · pi · opencode', value: 'Agent config', href: 'agent-config', guide: true },
        { name: 'Herdr', value: 'Herdr', href: 'herdr', guide: true },
        { name: 'Ghostty · Karabiner', value: 'Keymaps', href: 'keymaps', guide: true },
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
  footerWhat: 'Tak, coding agent setup',
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  skipLabel: 'Skip to content',
};

const ko: HomeCopy = {
  title: 'Tak',
  documentTitle: '코딩 에이전트 설정, 검사까지 — Tak',
  description:
    'Claude Code·pi·opencode 설정과 그걸 굴리는 워크플로우, 그 밑의 원칙. 가이드마다 직접 돌려 볼 확인 방법으로 끝난다.',
  headline: '코딩 에이전트 설정을 검사와 함께 적었다',
  lede: 'Claude Code·pi·opencode 설정과 그걸 굴리는 워크플로우, 그 밑의 원칙. 가이드마다 직접 돌려 볼 확인 방법으로 끝난다.',
  primaryCta: '원칙부터 읽기',
  allGuides: '전체 가이드',
  checksTitle: '이 페이지의 완료 기준',
  checksRun: '검사 실행',
  checksPending: '미실행',
  lineCount: (lines) => `${lines}줄`,
  pagesExist: '문서 있음',
  checks: [
    { id: 'headline', claim: '제목은 두 줄 이하로 보인다.' },
    { id: 'contrast', claim: '본문은 배경과 4.5:1 이상 대비가 난다.' },
    { id: 'guides', claim: '가이드 링크는 모두 있는 문서를 가리킨다.' },
    { id: 'nav', claim: 'nav 링크는 세 개를 넘지 않는다.' },
  ],
  introHeading: '"끝났다" 대신 명령 한 줄',
  intro: [
    '에이전트에게 일을 맡길 때 첫 줄에 끝났을 때 참이어야 할 결과와 그것을 재는 명령을 같이 적는다.',
    '구현 전에 그 명령이 red 로 나와야 하고, 구현이 시작되면 기준을 고정한다. 모델은 판정 칸만 채우고, 근거는 실제로 돌린 명령의 출력 한 줄이다.',
    '리뷰어는 통과선을 모른 채 플랜과 diff 만 본다. 설계와 스코프는 draft PR 에서 내가 판단한다.',
    '규칙마다 왜 생겼는지 날짜와 함께 적어 둔다. 지워도 되는지 다음 사람이 판정할 수 있게.',
  ],
  introLink: '원칙 읽기',
  hookCaption: '규칙은 부탁하고, 훅은 막는다. 이 페이지를 만드는 동안 훅이 막은 커밋이다.',
  hookSession: [
    '$ git commit -m "feat(site): refocus the site on the guides…"',
    '[commit-convention] 커밋 차단 — AI co-author 트레일러',
    '  줄: Co-Authored-By: Claude …',
    '  이 줄을 메시지에서 빼고 같은 커밋을 다시 실행하라.',
    '$ git commit -m "feat(site): refocus the site on the guides…"',
    'c53c335 feat(site): refocus the site on the guides and add a principles guide',
  ],
  stagesHeading: '작업 하나가 가는 길',
  stages: [
    {
      statement: '먼저 완료 기준을 선언한다.',
      body: '첫 줄에 작업 종류, 크기, 완료 기준과 그것을 재는 명령을 적는다. 틀렸으면 그 줄을 내가 고친다.',
      session: [
        '> /orch 블로그 목록에 태그 필터 추가',
        'orch: add · M · 파일 4개 · 완료: 태그를 고르면 그 태그 글만 남는다 · check: `pnpm test` · 멈춤: pr',
      ],
    },
    {
      statement: '그다음 슬라이스로 쪼개 파일에 쓴다.',
      body: '슬라이스마다 검증 명령을 묶어 플랜 파일에 쓴다. 세션이 끊겨도 이 파일에서 이어 간다.',
      session: [
        '.claude/<날짜>/PLAN-<시각>.md',
        '## Slice Queue',
        '- [ ] s01 groupByYear · tagCounts · filterByTag',
        '- [ ] s02 /blog 연도 묶음과 태그 칩',
        '## Acceptance Contract',
        '- AC-1 · s01 · WHEN 태그를 고르면 THE 목록 SHALL 그 태그 글만 남긴다 · status: FAIL',
      ],
    },
    {
      statement: '슬라이스마다 처음 보는 리뷰어가 본다.',
      body: '대화를 모르는 리뷰어가 플랜과 diff 만 읽는다. 세 번 안에 통과하지 못하면 멈추고 보고한다.',
      session: [
        '03-review · slice s01',
        'finder (새 서브에이전트): Critical 0 · Important 1',
        '04-fix → verify green → 재리뷰 PASS',
        '- [x] s01 groupByYear · tagCounts · filterByTag',
        '- AC-1 · s01 · status: PASS · evidence: `pnpm test` → passed',
      ],
    },
    {
      statement: 'draft PR 에서 멈춘다.',
      body: '큐가 비면 브랜치 전체를 한 번 더 리뷰하고, 묻지 않고 정한 것은 PR 본문에 적는다.',
      session: [
        '$ gh pr create --draft',
        'feat(blog): group posts by year and filter by tag',
        'Auto-decided:',
        '- 필터는 URL 이 아니라 클라이언트 상태다. 프리렌더한 목록과 hydration 이 맞아야 한다.',
      ],
    },
    {
      statement: '머지는 내가 한다.',
      body: '/land 가 squash 머지, worktree 정리, 로컬 main 최신화를 한 번에 끝낸다.',
      session: ['> /land', 'squash merge · worktree 정리 · main 최신화'],
    },
  ],
  guidesHeading: '가이드',
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
  aboutHeading: '쓰는 사람',
  facts: [
    { label: '이름', value: '진형탁' },
    { label: '하는 일', value: '프론트엔드 개발자' },
    { label: '시작', value: '2018년, 웹' },
  ],
  bio: 'C++ 초음파 소프트웨어로 시작해 2018년부터 웹, React Native, Electron 제품을 만들고 있다. 요즘은 코딩 에이전트에게 일을 맡기는 방식을 다듬고, 바꿀 때마다 그 이유를 적어 둔다.',
  recordGroups: [
    {
      word: '도구',
      records: [
        { name: 'Claude Code · pi · opencode', value: '에이전트 설정', href: 'agent-config', guide: true },
        { name: 'Herdr', value: 'Herdr', href: 'herdr', guide: true },
        { name: 'Ghostty · Karabiner', value: '키맵', href: 'keymaps', guide: true },
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
  footerWhat: 'Tak, 코딩 에이전트 설정 문서',
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
