import { i18n } from './i18n';

/** One guide card: `slug` is the top-level folder under content/docs. */
export interface HomeGuide {
  readonly slug: string;
  readonly title: string;
  readonly blurb: string;
}

export interface HomeCopy {
  readonly title: string;
  readonly description: string;
  readonly heading: string;
  readonly intro: string;
  readonly docsCta: string;
  readonly guidesHeading: string;
  readonly recentPostsHeading: string;
  readonly allPostsLabel: string;
  readonly guides: readonly HomeGuide[];
}

const en: HomeCopy = {
  title: 'Tak',
  description: 'How I set up coding agents, terminals, and keymaps, written so you can copy it.',
  heading: 'My development setup, written down',
  intro:
    'Agent configuration, the workflow I run it with, Herdr, and keymaps. Each guide explains how a piece works, shows my config, and ends with a way to check it.',
  docsCta: 'Read the docs',
  guidesHeading: 'Guides',
  recentPostsHeading: 'Recent posts (Korean)',
  allPostsLabel: 'All posts',
  guides: [
    { slug: 'agent-config', title: 'Agent config', blurb: 'Rules, hooks, and skills for Claude Code, pi, and opencode.' },
    { slug: 'workflow', title: 'Workflow', blurb: 'How a task goes from plan to merged PR.' },
    { slug: 'herdr', title: 'Herdr', blurb: 'Terminal workspace setup and its keyboard shortcuts.' },
    { slug: 'keymaps', title: 'Keymaps', blurb: 'macOS keyboard defaults, Ghostty keys, Karabiner, and LazyVim.' },
    { slug: 'setup', title: 'Mac setup', blurb: 'The order I set up a new Mac in.' },
  ],
};

const ko: HomeCopy = {
  title: 'Tak',
  description: '코딩 에이전트·터미널·키맵 설정을 그대로 가져다 쓸 수 있게 정리한 곳.',
  heading: '내 개발 환경을 글로 남긴다',
  intro:
    '에이전트 설정, 그걸 굴리는 워크플로우, Herdr, 키맵. 가이드마다 동작 원리와 내 설정, 확인 방법을 차례로 적었다.',
  docsCta: '문서 보기',
  guidesHeading: '가이드',
  recentPostsHeading: '최근 글',
  allPostsLabel: '전체 글',
  guides: [
    { slug: 'agent-config', title: '에이전트 설정', blurb: 'Claude Code·pi·opencode 의 규칙·훅·스킬.' },
    { slug: 'workflow', title: '워크플로우', blurb: '작업 하나가 계획에서 머지까지 가는 길.' },
    { slug: 'herdr', title: 'Herdr', blurb: '터미널 작업 공간 설정과 단축키.' },
    { slug: 'keymaps', title: '키맵', blurb: 'macOS 키보드 기본값·Ghostty 키·Karabiner·LazyVim.' },
    { slug: 'setup', title: '맥 셋업', blurb: '새 맥을 세팅하는 순서.' },
  ],
};

const HOME_COPY: Record<string, HomeCopy> = { en, ko };

export const homeCopy = (locale: string | undefined): HomeCopy =>
  HOME_COPY[locale ?? i18n.defaultLanguage] ?? HOME_COPY[i18n.defaultLanguage];
