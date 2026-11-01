import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

const STEP = 74;
const H = 52;
const rowY = (i: number) => 12 + i * STEP;
const mid = (i: number) => rowY(i) + H / 2;

// Source: agent-config agent-skills/01-plan/references/acceptance-contract.md and
// claude/docs/CONTRACT-EVIDENCE.md (falsify, freeze by hash, verdict columns, the audit against the ledger).
const CONTRACT_COPY = {
  ko: {
    title: '완료 기준은 반증하고, 동결하고, 판정 칸만 채운 뒤 원장과 대조해요',
    description:
      '완료 기준 한 줄에는 관측 조건과 그것을 재는 명령이 같이 있어요. 구현 전에 명령을 돌려 red 가 나오는지 보고, green 이면 기준을 고쳐요. 구현이 시작되면 기준을 해시로 동결해요. 구현하는 모델은 status 와 evidence 칸만 채우고, 스크립트가 그 신고를 검증 원장과 다시 대조해요.',
    steps: [
      ['기준 한 줄', '조건과 재는 명령'],
      ['반증', '구현 전에 red 를 확인해요'],
      ['동결', '기준을 해시로 고정해요'],
      ['자기평가', 'status·evidence 칸만 채워요'],
      ['원장 대조', '스크립트가 신고를 다시 봐요'],
    ],
  },
  en: {
    title: 'A criterion is falsified, frozen, self-assessed and checked against the ledger',
    description:
      'Each criterion pairs an observable condition with the command that measures it. Before implementing, the command must come back red; a green one means the criterion is rewritten. Once work starts, the criteria are frozen by a hash. The implementing model fills in only status and evidence, and a script checks that report against the verification ledger.',
    steps: [
      ['One criterion', 'condition plus command'],
      ['Falsify', 'red before any code'],
      ['Freeze', 'fixed by a hash'],
      ['Self-assess', 'status and evidence only'],
      ['Audit', 'a script checks the report'],
    ],
  },
};

export const ContractFlowDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(CONTRACT_COPY, lang);
  return (
    <Diagram width={360} height={rowY(5) - STEP + H + 12} title={copy.title} description={copy.description}>
      {copy.steps.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[180, rowY(i - 1) + H], [180, rowY(i) - 2]]} /> : null}
          <Box x={40} y={rowY(i)} w={280} h={H} label={label} sub={sub} tone={i === 0 ? 'brand' : 'default'} />
        </g>
      ))}
    </Diagram>
  );
};

// Source: agent-config agent-skills/03-review/SKILL.md (the finder; the main session reads the pass line
// after finding) and agent-skills/03-review/GATE.md ("read only after finding is over").
const REVIEW_COPY = {
  ko: {
    title: '파인더는 통과선을 모른 채 finding 을 내고, 통과선은 메인 세션이 그 뒤에 대요',
    description:
      '파인더 서브에이전트는 대화나 이전 판정 없이 플랜, diff, 레포 관례를 받아 finding 을 내요. 통과선이 적힌 GATE.md 는 파인더에게 주지 않고, finding 이 다 나온 뒤 메인 세션만 읽어서 PASS 나 FAIL 을 정해요. FAIL 이면 고친 뒤 파인더가 다시 확인해요.',
    rows: [
      ['플랜·diff', '대화·이전 판정 없이'],
      ['파인더', '통과선을 몰라요'],
      ['finding', '매긴 심각도 그대로'],
      ['메인 세션', '여기서 통과선을 대요'],
      ['PASS·FAIL', 'FAIL 이면 고쳐서 다시'],
    ],
    gate: '통과선',
  },
  en: {
    title: 'The finder reports without knowing the bar; the main session applies it afterwards',
    description:
      'The finder subagent gets the plan, the diff and the repo conventions, but not the conversation or earlier verdicts, and returns findings. GATE.md, which holds the passing bar, is never given to it; the main session reads it only after finding is over and decides PASS or FAIL. On FAIL the code is fixed and the finder checks again.',
    rows: [
      ['Plan and diff', 'no chat, no verdicts'],
      ['Finder', 'does not know the bar'],
      ['Findings', 'severity as found'],
      ['Main session', 'applies the bar here'],
      ['PASS or FAIL', 'FAIL: fix, recheck'],
    ],
    gate: 'the bar',
  },
};

const COL_X = 24;
const COL_W = 196;

export const ReviewSplitDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(REVIEW_COPY, lang);
  const centre = COL_X + COL_W / 2;
  return (
    <Diagram width={360} height={rowY(5) - STEP + H + 12} title={copy.title} description={copy.description}>
      {copy.rows.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[centre, rowY(i - 1) + H], [centre, rowY(i) - 2]]} /> : null}
          <Box x={COL_X} y={rowY(i)} w={COL_W} h={H} label={label} sub={sub} tone={i === 1 ? 'brand' : 'default'} />
        </g>
      ))}
      <Arrow points={[[COL_X, mid(4)], [10, mid(4)], [10, mid(1)], [COL_X - 2, mid(1)]]} dashed />
      <Box x={252} y={rowY(3)} w={92} h={H} label="GATE.md" sub={copy.gate} tone="muted" />
      <Arrow points={[[252, mid(3)], [COL_X + COL_W + 2, mid(3)]]} />
    </Diagram>
  );
};
