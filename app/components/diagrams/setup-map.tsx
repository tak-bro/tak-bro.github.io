import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: agent-config README (Claude Code carries the full set; pi and opencode share the skill
// tree, and opencode runs the guard hooks through a plugin) and install.sh (where each part links).
const MAP_COPY = {
  ko: {
    title: '레포 하나의 규칙·훅·스킬을 세 하네스가 같이 써요',
    description:
      'agent-config 레포 하나에 규칙, 훅, 스킬이 있어요. 규칙은 에이전트가 읽고 따르는 글이고, 훅은 규칙을 어기는 명령을 실행 전에 막고, 스킬은 작업 순서를 정해요. 이 세 가지를 Claude Code, opencode, pi 가 같이 써요.',
    repoSub: '레포 하나',
    rules: ['규칙', '읽고 따라요'],
    hooks: ['훅', '어기면 막아요'],
    skills: ['스킬', '순서를 정해요'],
    harnessSub: '세 하네스가 같이 써요',
  },
  en: {
    title: 'Three harnesses share the rules, hooks and skills of one repo',
    description:
      'One repo, agent-config, holds rules, hooks and skills. Rules are text the agent reads and follows, hooks stop a command that breaks a rule before it runs, and skills set the order of the work. Claude Code, opencode and pi all use the three.',
    repoSub: 'one repo',
    rules: ['Rules', 'followed'],
    hooks: ['Hooks', 'block'],
    skills: ['Skills', 'set steps'],
    harnessSub: 'all three share them',
  },
};

const PART_W = 104;
const PART_Y = 108;
const PART_H = 60;
const partX = (i: number) => 20 + i * (PART_W + 12);
const partMid = (i: number) => partX(i) + PART_W / 2;
const HARNESS_Y = 208;

export const SetupMapDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(MAP_COPY, lang);
  const parts = [copy.rules, copy.hooks, copy.skills];
  return (
    <Diagram width={360} height={276} title={copy.title} description={copy.description}>
      <Box x={20} y={12} w={320} h={56} label="agent-config" sub={copy.repoSub} tone="brand" />
      {parts.map(([label, sub], i) => (
        <g key={label}>
          <Arrow points={[[180, 68], [180, 88], [partMid(i), 88], [partMid(i), PART_Y - 2]]} />
          <Box x={partX(i)} y={PART_Y} w={PART_W} h={PART_H} label={label} sub={sub} />
          <Arrow points={[[partMid(i), PART_Y + PART_H], [partMid(i), HARNESS_Y - 2]]} />
        </g>
      ))}
      <Box x={20} y={HARNESS_Y} w={320} h={56} label="Claude Code · opencode · pi" sub={copy.harnessSub} />
    </Diagram>
  );
};
