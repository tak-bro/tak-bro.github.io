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

export interface HomeCopy {
  readonly title: string;
  readonly description: string;
  readonly heading: string;
  readonly intro: string;
  readonly docsCta: string;
  readonly resumeLabel: string;
  readonly resumeHref: string;
  readonly guidesHeading: string;
  readonly guideGroups: readonly HomeGuideGroup[];
  readonly projectsHeading: string;
  readonly allProjectsLabel: string;
  readonly blogHeading: string;
  readonly allPostsLabel: string;
  readonly codeLicense: string;
  readonly contentLicense: string;
  readonly newTabLabel: string;
  readonly guides: readonly HomeGuide[];
}

const en: HomeCopy = {
  title: 'Tak',
  description: 'How I set up coding agents, terminals, and keymaps, written so you can copy it.',
  heading: 'My development setup, written down',
  intro:
    'Agent configuration, the workflow I run it with, Herdr, keymaps, and Mac setup. Each guide explains how a piece works, shows my config, and ends with a way to check it.',
  docsCta: 'Read the guides',
  resumeLabel: 'Resume',
  resumeHref: '/assets/resume_eng.pdf',
  guidesHeading: 'Guides',
  guideGroups: [
    { id: 'agents', heading: 'Coding agents' },
    { id: 'machine', heading: 'Terminal and Mac' },
  ],
  projectsHeading: 'Projects (Korean)',
  allProjectsLabel: 'All projects',
  blogHeading: 'Blog archive (Korean)',
  allPostsLabel: 'All posts',
  codeLicense: 'Code: MIT',
  contentLicense: 'Content: CC BY 4.0',
  newTabLabel: '(opens in a new tab)',
  guides: [
    { slug: 'agent-config', group: 'agents', title: 'Agent config', blurb: 'Rules, hooks, and subagents for Claude Code, pi, and opencode.' },
    { slug: 'workflow', group: 'agents', title: 'Workflow', blurb: 'How a task goes from plan to merged PR.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: 'Terminal workspace setup and its keyboard shortcuts.' },
    { slug: 'keymaps', group: 'machine', title: 'Keymaps', blurb: 'macOS keyboard defaults, Ghostty keys, Karabiner, and LazyVim.' },
    { slug: 'setup', group: 'machine', title: 'Mac setup', blurb: 'The order I set up a new Mac in.' },
  ],
};

const ko: HomeCopy = {
  title: 'Tak',
  description: '코딩 에이전트·터미널·키맵 설정을 그대로 가져다 쓸 수 있게 정리한 곳.',
  heading: '내 개발 환경을 글로 남긴다',
  intro:
    '에이전트 설정, 그걸 굴리는 워크플로우, Herdr, 키맵, 맥 셋업. 가이드마다 동작 원리와 내 설정, 확인 방법을 차례로 적었다.',
  docsCta: '가이드 읽기',
  resumeLabel: '이력서',
  resumeHref: '/assets/resume.pdf',
  guidesHeading: '가이드',
  guideGroups: [
    { id: 'agents', heading: '코딩 에이전트' },
    { id: 'machine', heading: '터미널과 맥' },
  ],
  projectsHeading: '프로젝트',
  allProjectsLabel: '전체 프로젝트',
  blogHeading: '블로그 아카이브',
  allPostsLabel: '전체 글',
  codeLicense: '코드: MIT',
  contentLicense: '글: CC BY 4.0',
  newTabLabel: '(새 탭)',
  guides: [
    { slug: 'agent-config', group: 'agents', title: '에이전트 설정', blurb: 'Claude Code·pi·opencode 의 규칙·훅·서브에이전트.' },
    { slug: 'workflow', group: 'agents', title: '워크플로우', blurb: '작업 하나가 계획에서 머지까지 가는 길.' },
    { slug: 'herdr', group: 'machine', title: 'Herdr', blurb: '터미널 작업 공간 설정과 단축키.' },
    { slug: 'keymaps', group: 'machine', title: '키맵', blurb: 'macOS 키보드 기본값·Ghostty 키·Karabiner·LazyVim.' },
    { slug: 'setup', group: 'machine', title: '맥 셋업', blurb: '새 맥을 세팅하는 순서.' },
  ],
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
