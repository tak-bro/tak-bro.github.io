import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: dotfiles ghostty/config (the herdr key table: super+t sends CSI 116;9u; super+shift+h toggles the table)
// and herdr/config.toml (new_tab on that key).
const KEY_COPY = {
  ko: {
    title: 'herdr 테이블이 켜져 있을 때만 Cmd+T 가 herdr 에 닿아요',
    description:
      'Cmd+T 를 누르면 Ghostty 가 먼저 받아요. herdr 키 테이블이 켜져 있으면 Ghostty 가 키를 kitty keyboard protocol 이스케이프 시퀀스 CSI 116;9u 로 바꿔 보내고, herdr 가 그것을 new_tab 으로 읽어요. 테이블이 꺼져 있으면 Ghostty 가 원래 동작대로 새 탭을 열어요.',
    ghosttySub: 'herdr 테이블이 켜졌나요?',
    on: '켜졌을 때',
    off: ['Ghostty 새 탭', '꺼졌을 때'],
  },
  en: {
    title: 'Cmd+T reaches herdr only while the herdr table is on',
    description:
      'Ghostty receives Cmd+T first. While the herdr key table is on, Ghostty turns the key into the kitty keyboard protocol escape sequence CSI 116;9u and sends it on, and herdr reads that as new_tab. With the table off, Ghostty does what it always does and opens a new tab.',
    ghosttySub: 'is the herdr table on?',
    on: 'table on',
    off: ['Ghostty new tab', 'table off'],
  },
};

export const KeyPathDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(KEY_COPY, lang);
  return (
    <Diagram width={360} height={324} title={copy.title} description={copy.description}>
      <Box x={110} y={12} w={140} h={48} label="Cmd+T" tone="brand" />
      <Arrow points={[[180, 60], [180, 82]]} />
      <Box x={60} y={84} w={240} h={56} label="Ghostty" sub={copy.ghosttySub} />
      <Arrow points={[[180, 140], [180, 154], [95, 154], [95, 170]]} />
      <Arrow points={[[180, 154], [265, 154], [265, 170]]} />
      <Box x={20} y={172} w={150} h={56} label="CSI 116;9u" sub={copy.on} />
      <Box x={190} y={172} w={150} h={56} label={copy.off[0]} sub={copy.off[1]} tone="muted" />
      <Arrow points={[[95, 228], [95, 254]]} />
      <Box x={20} y={256} w={150} h={56} label="herdr" sub="new_tab" mono />
    </Diagram>
  );
};

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
