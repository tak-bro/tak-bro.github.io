import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: agent-config skills/*/SKILL.md descriptions — explore (read-only fork), grilling (stress-tests a plan
// or decision), investigate (root cause of a defect with a red signal, analysis only), simplify (cleanup, not bug
// hunting), review (pre-landing review in a fresh context), explain-diff (a diff turned into an explainer with a
// quiz), summary (prompt / handover modes); the main path is orch → 01-plan → 02-implement → ship, merged by /land.
/** A box: its label, then the muted line under it. */
type Row = readonly [string, string];

interface Step {
  readonly step: Row;
  readonly skill: Row;
  /** A step I take myself rather than the agent (drawn muted, as in the workflow chain). */
  readonly mine?: true;
}

interface MapCopy {
  readonly title: string;
  readonly description: string;
  /** The main path, top to bottom, each step with the skill I call beside it. */
  readonly steps: readonly Step[];
  readonly handover: Row;
}

const MAP_COPY: Record<'ko' | 'en', MapCopy> = {
  ko: {
    title: '자주 쓰는 스킬은 본선 길의 단계마다 옆에 붙어요',
    description:
      '왼쪽은 작업 하나가 지나는 본선 길이에요. 탐색, /01-plan, /02-implement, /ship, draft PR, /land 순서예요. 오른쪽은 제가 그 단계 옆에서 부르는 스킬이에요. 탐색에는 읽기 전용 fork 인 /explore, 플랜에는 결정을 끝까지 캐묻는 /grilling, 구현에는 빨간 신호가 있을 때 원인만 찾는 /investigate, ship 전에는 군더더기를 걷는 /simplify, draft PR 에는 게이트 밖 diff 를 처음부터 보는 /review, 머지 전에는 제가 설명할 수 있는지 재는 /explain-diff 가 붙어요. 세션을 넘길 때는 /summary 를 써요.',
    steps: [
      { step: ['탐색', '아는 곳은 생략'], skill: ['/explore', '읽기 전용 fork'] },
      { step: ['/01-plan', '플랜'], skill: ['/grilling', '결정을 끝까지 캐물어요'] },
      { step: ['/02-implement', '슬라이스 루프'], skill: ['/investigate', '빨간 신호 뒤 원인만'] },
      { step: ['/ship', '검증·PR 열기'], skill: ['/simplify', 'ship 전에 군더더기'] },
      { step: ['draft PR', '여기서 멈춰요'], skill: ['/review', '게이트 밖 diff 를 처음부터'] },
      { step: ['/land', '머지'], skill: ['/explain-diff', '설명할 수 있어야 머지'], mine: true },
    ],
    handover: ['/summary', '세션을 넘길 때 prompt·handover'],
  },
  en: {
    title: 'The skills I reach for sit beside each step of the main path',
    description:
      'On the left is the main path one task takes: explore, /01-plan, /02-implement, /ship, draft PR, /land. On the right are the skills I call beside each step. Explore gets /explore, a read-only fork; the plan gets /grilling, which questions a decision to the end; implementing gets /investigate, which finds only the cause once there is a red signal; before ship, /simplify clears the excess; at the draft PR, /review reads a diff that skipped the gate from scratch; before the merge, /explain-diff checks that I can explain the change. Handing a session over uses /summary.',
    steps: [
      { step: ['Explore', 'skipped if known'], skill: ['/explore', 'read-only fork'] },
      { step: ['/01-plan', 'plan'], skill: ['/grilling', 'question to the end'] },
      { step: ['/02-implement', 'slice loop'], skill: ['/investigate', 'cause only, after red'] },
      { step: ['/ship', 'verify, open PR'], skill: ['/simplify', 'excess, before ship'] },
      { step: ['draft PR', 'stops here'], skill: ['/review', 'gateless diff, fresh'] },
      { step: ['/land', 'merge'], skill: ['/explain-diff', 'can I explain it?'], mine: true },
    ],
    handover: ['/summary', 'handing a session over: prompt, handover'],
  },
};

const STEP = 60;
const H = 46;
const PATH_X = 10;
const PATH_W = 140;
const SIDE_X = 176;
const SIDE_W = 174;
const rowY = (i: number) => 12 + i * STEP;

export const SkillMapDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(MAP_COPY, lang);
  const handoverY = rowY(copy.steps.length) + 12;
  return (
    <Diagram width={360} height={handoverY + H + 12} title={copy.title} description={copy.description}>
      {copy.steps.map(({ step: [label, sub], skill: [skill, what], mine }, i) => {
        const y = rowY(i);
        const mid = y + H / 2;
        return (
          <g key={label}>
            {i > 0 ? <Arrow points={[[PATH_X + PATH_W / 2, rowY(i - 1) + H], [PATH_X + PATH_W / 2, y - 2]]} /> : null}
            <Box x={PATH_X} y={y} w={PATH_W} h={H} label={label} sub={sub} tone={mine ? 'muted' : 'default'} />
            <Arrow points={[[SIDE_X, mid], [PATH_X + PATH_W + 2, mid]]} dashed />
            <Box x={SIDE_X} y={y} w={SIDE_W} h={H} label={skill} sub={what} tone="brand" />
          </g>
        );
      })}
      <Box x={PATH_X} y={handoverY} w={SIDE_X + SIDE_W - PATH_X} h={H} label={copy.handover[0]} sub={copy.handover[1]} tone="muted" />
    </Diagram>
  );
};
