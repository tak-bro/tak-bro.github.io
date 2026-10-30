import { i18n } from './i18n';

export type HomeGuideGroupId = 'agents' | 'machine';

/** One guide card: `slug` is the top-level folder under content/docs. */
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

/** One stop of the `/orch` path in the hero's stage section, as in content/docs/workflow.mdx. */
export interface HomeStage {
  readonly word: string;
  readonly code: string;
  readonly body: string;
}

export interface HomeCopy {
  readonly title: string;
  readonly description: string;
  /** Who writes this: name, then role, shown above the heading. */
  readonly name: string;
  readonly role: string;
  /** The display heading, one entry per line. */
  readonly heroLines: readonly [string, string];
  readonly bio: string;
  readonly prompt: string;
  readonly promptCta: string;
  readonly statGuides: string;
  readonly statPosts: string;
  readonly stagesLabel: string;
  readonly stages: readonly HomeStage[];
  readonly intro: string;
  readonly docsCta: string;
  readonly resumeLabel: string;
  readonly resumeHref: string;
  readonly guidesHeading: string;
  readonly guideGroups: readonly HomeGuideGroup[];
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly guides: readonly HomeGuide[];
}

const en: HomeCopy = {
  title: 'Tak',
  description: 'How I set up coding agents, terminals, and keymaps, written so you can copy it.',
  name: 'Hyungtak Jin',
  role: 'Frontend engineer',
  heroLines: ['One line in,', 'a draft PR out.'],
  prompt: '/orch add a tag filter to the blog list',
  promptCta: 'See the workflow',
  statGuides: 'guides',
  statPosts: 'posts',
  stagesLabel: 'The path of one task',
  stages: [
    {
      word: 'Declare',
      code: 'add · M · 4 files · done = pnpm check',
      body: 'The first line names the kind of task, its size, the done criterion and the command that measures it. If it is wrong, I fix that line.',
    },
    {
      word: 'Plan',
      code: '.claude/<date>/PLAN-<time>.md',
      body: 'The work is split into slices, each tied to a check, and written to a file. If the session drops, the run picks up from the file.',
    },
    {
      word: 'Review',
      code: 'slice 1 · review gate ✓',
      body: 'After each slice a reviewer that has not seen the conversation reads only the plan and the diff. Three failed rounds and it stops to report.',
    },
    {
      word: 'PR',
      code: 'gh pr create --draft',
      body: 'Once the queue is empty the whole branch is reviewed again, screens get QA, missing tests get written, and it stops at a draft PR.',
    },
    {
      word: 'Merge',
      code: '/land',
      body: 'The merge is mine. /land squash merges and cleans up the worktree in one go.',
    },
  ],
  bio: 'I have built web, React Native, and Electron products since 2018, after starting out on C++ ultrasound software. These days I keep refining how I hand work to coding agents.',
  intro:
    'Agent configuration, the workflow I run it with, plugins and MCP servers, Herdr, keymaps, and Mac setup. Each guide explains how a piece works, shows my config, and ends with a way to check it.',
  docsCta: 'Read the guides',
  resumeLabel: 'Resume',
  resumeHref: '/assets/resume_eng.pdf',
  guidesHeading: 'Guides',
  guideGroups: [
    { id: 'agents', heading: 'Coding agents' },
    { id: 'machine', heading: 'Terminal and Mac' },
  ],
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  guides: [
    { slug: 'agent-config', group: 'agents', title: 'Agent config', blurb: 'Rules, hooks, and subagents for Claude Code, pi, and opencode.' },
    { slug: 'workflow', group: 'agents', title: 'Workflow', blurb: 'How a task goes from plan to merged PR.' },
    { slug: 'plugins', group: 'agents', title: 'Plugins and MCP', blurb: 'The Claude Code plugins and MCP servers I keep on, and why.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: 'Terminal workspace setup and its keyboard shortcuts.' },
    { slug: 'keymaps', group: 'machine', title: 'Keymaps', blurb: 'macOS keyboard defaults, Ghostty keys, Karabiner, and LazyVim.' },
    { slug: 'setup', group: 'machine', title: 'Mac setup', blurb: 'The order I set up a new Mac in.' },
  ],
};

const ko: HomeCopy = {
  title: 'Tak',
  description: '코딩 에이전트·터미널·키맵 설정을 그대로 가져다 쓸 수 있게 정리한 곳.',
  name: '진형탁',
  role: '프론트엔드 개발자',
  heroLines: ['한 줄을 맡기면', 'draft PR 이 온다.'],
  prompt: '/orch 블로그 목록에 태그 필터 추가',
  promptCta: '워크플로우 보기',
  statGuides: '가이드',
  statPosts: '블로그 글',
  stagesLabel: '작업 하나가 가는 길',
  stages: [
    {
      word: '선언',
      code: '추가 · M · 파일 4개 · 완료 = pnpm check',
      body: '첫 줄에 작업 종류, 크기, 완료 기준과 그것을 재는 명령을 선언한다. 틀렸으면 그 줄을 내가 고친다.',
    },
    {
      word: '플랜',
      code: '.claude/<날짜>/PLAN-<시각>.md',
      body: '할 일을 슬라이스로 나누고 슬라이스마다 검증 명령을 묶어 파일에 쓴다. 세션이 끊겨도 이 파일에서 이어 간다.',
    },
    {
      word: '리뷰',
      code: 'slice 1 · review gate ✓',
      body: '슬라이스마다 대화를 모르는 리뷰어가 플랜과 diff 만 본다. 세 번 안에 통과하지 못하면 멈추고 보고한다.',
    },
    {
      word: 'PR',
      code: 'gh pr create --draft',
      body: '큐가 비면 브랜치 전체를 한 번 더 리뷰하고, 화면 QA 와 빠진 테스트를 챙긴 뒤 draft PR 에서 멈춘다.',
    },
    {
      word: '머지',
      code: '/land',
      body: '머지는 내가 한다. /land 가 squash 머지와 worktree 정리를 한 번에 끝낸다.',
    },
  ],
  bio: 'C++ 초음파 소프트웨어로 시작해 2018년부터 웹, React Native, Electron 제품을 만들고 있다. 요즘은 코딩 에이전트에게 일을 맡기는 방식을 다듬는다.',
  intro:
    '에이전트 설정, 그걸 굴리는 워크플로우, 플러그인·MCP, Herdr, 키맵, 맥 셋업. 가이드마다 동작 원리와 내 설정, 확인 방법을 차례로 적었다.',
  docsCta: '가이드 읽기',
  resumeLabel: '이력서',
  resumeHref: '/assets/resume.pdf',
  guidesHeading: '가이드',
  guideGroups: [
    { id: 'agents', heading: '코딩 에이전트' },
    { id: 'machine', heading: '터미널과 맥' },
  ],
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  guides: [
    { slug: 'agent-config', group: 'agents', title: '에이전트 설정', blurb: 'Claude Code·pi·opencode 의 규칙·훅·서브에이전트.' },
    { slug: 'workflow', group: 'agents', title: '워크플로우', blurb: '작업 하나가 계획에서 머지까지 가는 길.' },
    { slug: 'plugins', group: 'agents', title: '플러그인·MCP', blurb: '켜 두고 쓰는 Claude Code 플러그인과 MCP 서버.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: '터미널 작업 공간 설정과 단축키.' },
    { slug: 'keymaps', group: 'machine', title: '키맵', blurb: 'macOS 키보드 기본값·Ghostty 키·Karabiner·LazyVim.' },
    { slug: 'setup', group: 'machine', title: '맥 셋업', blurb: '새 맥을 세팅하는 순서.' },
  ],
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
