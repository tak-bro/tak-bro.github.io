import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: dotfiles herdr/config.toml (a tab-bar command entry runs pane-branch.sh every 5 s) and
// herdr/pane-branch.sh (report-metadata --token branch=… --ttl-ms 30000).
const BRANCH_COPY = {
  ko: {
    title: '사이드바의 브랜치는 5초마다 도는 스크립트가 보고해요',
    description:
      '탭 바 오른쪽의 보이지 않는 command 항목이 5초마다 pane-branch.sh 를 돌려요. 스크립트는 에이전트 pane 마다 git 브랜치를 읽어 herdr pane report-metadata 로 보고하고, 사이드바가 그 값을 $branch 토큰으로 보여 줘요. 토큰은 30초 TTL 이라 스크립트가 멈추면 표시도 사라져요.',
    steps: [
      ['command 항목', '탭 바 · 5초 간격'],
      ['pane-branch.sh', '에이전트 pane 의 브랜치'],
      ['report-metadata', 'TTL 30초'],
      ['사이드바 $branch', '멈추면 저절로 사라져요'],
    ],
  },
  en: {
    title: 'A script running every 5 seconds reports the branch shown in the sidebar',
    description:
      'An invisible command entry on the right of the tab bar runs pane-branch.sh every 5 seconds. The script reads the git branch of each agent pane and reports it with herdr pane report-metadata, and the sidebar shows it as the $branch token. The token has a 30-second TTL, so if the script stops, the label goes away.',
    steps: [
      ['Command entry', 'on the tab bar, every 5 s'],
      ['pane-branch.sh', 'branch of each agent pane'],
      ['report-metadata', 'TTL 30 s'],
      ['Sidebar $branch', 'disappears if it stops'],
    ],
  },
};

const STEP = 74;
const H = 52;
const rowY = (i: number) => 12 + i * STEP;

export const BranchTokenDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(BRANCH_COPY, lang);
  return (
    <Diagram width={360} height={rowY(3) + H + 12} title={copy.title} description={copy.description}>
      {copy.steps.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[180, rowY(i - 1) + H], [180, rowY(i) - 2]]} /> : null}
          <Box x={40} y={rowY(i)} w={280} h={H} label={label} sub={sub} tone={i === 0 ? 'brand' : 'default'} />
        </g>
      ))}
    </Diagram>
  );
};
