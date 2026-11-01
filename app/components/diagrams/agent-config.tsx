import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: agent-config install.sh header (the link table and "Not linked").
const REPO_COPY = {
  ko: {
    title: 'install.sh 가 레포의 각 부분을 하네스 자리에 심링크로 걸어요',
    description:
      'agent-config 레포에서 claude 항목은 ~/.claude 로, agent-skills 는 세 하네스가 같이 쓰는 ~/.agents/skills 로, pi/home 은 ~/.pi/agent 로, opencode 는 ~/.config/opencode 로 링크돼요. settings.json 과 .mcp.json 같은 파일은 링크하지 않고 처음 한 번만 복사해요.',
    repoSub: 'install.sh 로 심링크',
    claude: 'Claude Code',
    shared: '세 하네스가 같이 쓰는 스킬',
    copied: '설정 파일',
    copiedSub: '링크 대신 처음 한 번 복사',
  },
  en: {
    title: 'install.sh links each part of the repo where its harness looks',
    description:
      'From the agent-config repo, the claude items link into ~/.claude, agent-skills into ~/.agents/skills, which all three harnesses share, pi/home into ~/.pi/agent and opencode into ~/.config/opencode. Files such as settings.json and .mcp.json are not linked; they are copied once, on the first run.',
    repoSub: 'install.sh links each part',
    claude: 'Claude Code',
    shared: 'Shared skills (all three)',
    copied: 'Settings files',
    copiedSub: 'copied once, not linked',
  },
};

const ROW_X = 70;
const ROW_W = 270;
const ROW_H = 52;
const TRUNK = 44;
const rowY = (i: number) => 96 + i * 66;
const mid = (i: number) => rowY(i) + ROW_H / 2;

export const HarnessRepoDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(REPO_COPY, lang);
  const rows = [
    { label: copy.claude, sub: '~/.claude/<item>' },
    { label: copy.shared, sub: '~/.agents/skills/<name>' },
    { label: 'pi', sub: '~/.pi/agent/*' },
    { label: 'opencode', sub: '~/.config/opencode/*' },
  ];
  return (
    <Diagram width={360} height={436} title={copy.title} description={copy.description}>
      <Box x={20} y={12} w={320} h={56} label="agent-config" sub={copy.repoSub} tone="brand" />
      {rows.map((row, i) => (
        <g key={row.sub}>
          <Arrow points={[[TRUNK, 68], [TRUNK, mid(i)], [ROW_X - 2, mid(i)]]} />
          <Box x={ROW_X} y={rowY(i)} w={ROW_W} h={ROW_H} label={row.label} sub={row.sub} mono />
        </g>
      ))}
      <Arrow points={[[TRUNK, mid(3)], [TRUNK, mid(4) + 12], [ROW_X - 2, mid(4) + 12]]} dashed />
      <Box x={ROW_X} y={rowY(4) + 12} w={ROW_W} h={ROW_H} label={copy.copied} sub={copy.copiedSub} tone="muted" />
    </Diagram>
  );
};
