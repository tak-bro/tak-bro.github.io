import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: agent-config claude/docs/COMPOUNDING_README.md (the slice loop, then ship; the Monday compound lane reads last
// week's signals and only proposes, a person approves), agent-skills/01-plan/SKILL.md (Precedent: the plan cites past
// decisions from the KB) and agent-skills/01-plan/references/plan-template.md ("The plan is the intent; the Outcome is
// the facts"); knowledge-base scripts/distill-plans.sh (decision notes, concept notes over three or more notes, one
// overview a week).
const LOOP_COPY = {
  ko: {
    title: '끝난 작업은 금요일에 지식이 되고, 다음 플랜이 그 지식을 인용해요',
    description:
      '작업 하나는 요청에서 시작해 플랜 파일, 슬라이스 루프, draft PR 을 지나고, 실제로 일어난 일을 플랜의 Outcome 에 남겨요. 금요일 레인이 그 기록을 결정 노트와 개념 노트로 증류해 지식베이스에 쌓고, 월요일에는 지난주 신호로 규칙과 게이트 수정을 제안해요. 다음 플랜은 쓰기 전에 지식베이스에서 지난 결정을 찾아 인용해요.',
    task: [
      ['요청', '크기를 정해요'],
      ['플랜 파일', '지난 결정을 인용'],
      ['슬라이스 루프', '구현·리뷰·커밋'],
      ['draft PR', '머지는 사람이'],
    ],
    week: [
      ['Outcome 기록', '실제로 일어난 일'],
      ['금요일 증류', '결정 노트로'],
      ['지식베이스', '개념 노트·개요'],
      ['월요일 되먹임', '규칙 수정 제안'],
    ],
  },
  en: {
    title: 'A finished task becomes knowledge on Friday, and the next plan cites it',
    description:
      'A task starts as a request and passes the plan file, the slice loop and a draft PR, and what actually happened is left in the plan’s Outcome. A Friday lane distills that record into decision notes and concept notes in the knowledge base, and on Monday last week’s signals become proposed changes to rules and gates. Before the next plan is written, it looks up past decisions in the knowledge base and cites them.',
    task: [
      ['Request', 'the size is set'],
      ['Plan file', 'cites past decisions'],
      ['Slice loop', 'build, review, commit'],
      ['Draft PR', 'a person merges'],
    ],
    week: [
      ['Outcome', 'what happened'],
      ['Friday distill', 'into decision notes'],
      ['Knowledge base', 'concepts, overview'],
      ['Monday feedback', 'proposed changes'],
    ],
  },
};

const LOOP_STEP = 76;
const LOOP_H = 52;
const loopY = (i: number) => 12 + i * LOOP_STEP;
const loopMid = (i: number) => loopY(i) + LOOP_H / 2;

export const KnowledgeLoopDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(LOOP_COPY, lang);
  const last = copy.task.length - 1;
  return (
    <Diagram width={360} height={loopY(last) + LOOP_H + 12} title={copy.title} description={copy.description}>
      {copy.task.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[95, loopY(i - 1) + LOOP_H], [95, loopY(i) - 2]]} /> : null}
          <Box x={20} y={loopY(i)} w={150} h={LOOP_H} label={label} sub={sub} tone={i === 0 ? 'brand' : 'default'} />
        </g>
      ))}
      <Arrow points={[[170, loopMid(last)], [188, loopMid(last)]]} />
      {copy.week.map(([label, sub], i) => {
        const row = last - i;
        return (
          <g key={label}>
            {i > 0 ? <Arrow points={[[265, loopY(row + 1)], [265, loopY(row) + LOOP_H + 2]]} /> : null}
            <Box x={190} y={loopY(row)} w={150} h={LOOP_H} label={label} sub={sub} tone={i === copy.week.length - 1 ? 'muted' : 'default'} />
          </g>
        );
      })}
      <Arrow points={[[190, loopMid(0)], [180, loopMid(0)], [180, loopMid(1)], [172, loopMid(1)]]} dashed />
    </Diagram>
  );
};

// Source: agent-config agent-skills/01-plan/references/plan-template.md (the sections; `[x]` only on a review gate
// PASS; the Outcome is left empty for 02-implement, 03-review, 04-fix and ship) and
// agent-skills/01-plan/references/acceptance-contract.md (02-implement fills each row's status and evidence).
const PLAN_COPY = {
  ko: {
    title: '플랜은 의도를 적고, Outcome 은 실제로 일어난 일을 적어요',
    description:
      '플랜 파일의 주요 절은 Spec, Acceptance Contract, Boundaries, Seams, Slice Queue, Verification Commands, Decisions, Outcome 이에요. 앞의 일곱 절은 플랜 단계가 써요. 그중 계약의 판정 칸은 구현이 채우고, 큐의 체크는 리뷰 게이트를 통과할 때 붙어요. Outcome 은 구현, 리뷰, 수정, ship 이 리뷰 판정과 fix 루프 횟수, 커밋을 그대로 적는 칸이에요.',
    sections: [
      ['Spec', '무엇을 끝낼지'],
      ['Acceptance Contract', '판정 칸은 구현이'],
      ['Boundaries', '할 것과 안 할 것'],
      ['Seams', '공개 경계'],
      ['Slice Queue', '체크는 리뷰 통과 때'],
      ['Verification', '재는 명령'],
      ['Decisions', '고른 것과 이유'],
      ['Outcome', '판정·횟수·커밋'],
    ],
    intent: ['의도', '플랜이 써요'],
    facts: ['사실', '실행이 채워요'],
  },
  en: {
    title: 'The plan holds the intent, and the Outcome holds what actually happened',
    description:
      'The main sections of a plan file are Spec, Acceptance Contract, Boundaries, Seams, Slice Queue, Verification Commands, Decisions and Outcome. The plan step writes the first seven. Within them, the implementer fills in the contract’s verdict cells, and a slice is ticked when it passes the review gate. The Outcome is where implement, review, fix and ship record the review verdicts, the fix-loop counts and the commits as they happened.',
    sections: [
      ['Spec', 'what done means'],
      ['Acceptance Contract', 'verdicts by implement'],
      ['Boundaries', 'do and don’t'],
      ['Seams', 'public boundaries'],
      ['Slice Queue', 'ticked on review pass'],
      ['Verification', 'commands that measure'],
      ['Decisions', 'choices and why'],
      ['Outcome', 'verdicts, counts, commits'],
    ],
    intent: ['Intent', 'the plan writes'],
    facts: ['Facts', 'the run fills in'],
  },
};

const SECTION_STEP = 46;
const SECTION_H = 40;
const sectionY = (i: number) => 12 + i * SECTION_STEP;

export const PlanAnatomyDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(PLAN_COPY, lang);
  const outcome = copy.sections.length - 1;
  return (
    <Diagram width={360} height={sectionY(outcome) + SECTION_H + 12} title={copy.title} description={copy.description}>
      {copy.sections.map(([label, sub], i) => (
        <Box key={label} x={20} y={sectionY(i)} w={200} h={SECTION_H} label={label} sub={sub} tone={i === outcome ? 'brand' : 'default'} />
      ))}
      <Box x={232} y={sectionY(0)} w={108} h={sectionY(outcome - 1) + SECTION_H - sectionY(0)} label={copy.intent[0]} sub={copy.intent[1]} tone="muted" />
      <Box x={232} y={sectionY(outcome)} w={108} h={SECTION_H} label={copy.facts[0]} sub={copy.facts[1]} tone="brand" />
    </Diagram>
  );
};

// Source: agent-config claude/docs/LANES.md (the Friday lanes and their times, compound on Monday 11:00 reading the
// retro, plan-distill, friction and cleanup signals, proposals approved by a person) and knowledge-base
// scripts (the Friday memory-distill launchd job at 16:30, missing from the LANES table).
const FRIDAY_COPY = {
  ko: {
    title: '금요일 레인이 한 주의 기록을 정리하고, 월요일 compound 가 그 신호를 읽어요',
    description:
      '금요일 11시 45분에 레포를 동기화하고, 12시부터 13시까지 캐시와 도구를 정리하고 코드 그래프를 다시 색인해요. 14시에 레포 건강 지표를 모으고, 15시에 주간 회고가 마찰을 적어요. 16시에 플랜 증류, 16시 30분에 세션 기억 증류가 돌아요. 17시에는 짝수 주마다 마찰을 모으고, 18시에는 홀수 주마다 청소해요. 19시 30분에 검색 인덱스를 정리해요. 월요일 11시에는 compound 가 회고, 플랜 증류, 마찰, 청소 레인의 신호를 읽어 규칙과 게이트 수정을 제안하고, 적용은 사람이 승인해요.',
    lanes: [
      ['11:45', '동기화', '레포를 최신으로'],
      ['12:00', '환경 정리', '캐시·도구·코드 그래프'],
      ['14:00', '레포 건강', '지표와 회귀 후보'],
      ['15:00', '주간 회고', '마찰을 적어요'],
      ['16:00', '플랜 증류', '결정·개념 노트, 개요'],
      ['16:30', '세션 기억 증류', '작업 기억 노트'],
      ['17:00', '마찰 수집', '짝수 주'],
      ['18:00', '청소', '홀수 주'],
      ['19:30', '검색 인덱스 정리', '남은 조각을 지워요'],
    ],
    monday: ['월 11:00', 'compound', '수정 제안 · 승인은 사람'],
  },
  en: {
    title: 'Friday lanes tidy up the week’s record, and Monday’s compound reads the signals',
    description:
      'On Friday at 11:45 the repos are synced, and from 12:00 to 13:00 caches and tools are cleaned and the code graph is indexed again. At 14:00 repo health metrics are collected, and at 15:00 the weekly retro writes down friction. Plan distillation runs at 16:00 and session memory distillation at 16:30. At 17:00 friction is collected on even weeks, and at 18:00 a cleanup runs on odd weeks. At 19:30 the search index is tidied. On Monday at 11:00, compound reads the signals of the retro, plan distill, friction and cleanup lanes and proposes changes to rules and gates, which a person approves.',
    lanes: [
      ['11:45', 'Sync', 'repos up to date'],
      ['12:00', 'Environment', 'caches, tools, code graph'],
      ['14:00', 'Repo health', 'metrics, regressions'],
      ['15:00', 'Weekly retro', 'friction written down'],
      ['16:00', 'Plan distill', 'decisions, concepts'],
      ['16:30', 'Memory distill', 'session memory notes'],
      ['17:00', 'Friction', 'even weeks'],
      ['18:00', 'Cleanup', 'odd weeks'],
      ['19:30', 'Search index', 'leftovers removed'],
    ],
    monday: ['Mon 11:00', 'compound', 'proposes, a person approves'],
  },
};

const LANE_STEP = 46;
const LANE_H = 40;
const laneY = (i: number) => 12 + i * LANE_STEP;
const laneMid = (i: number) => laneY(i) + LANE_H / 2;
/** The lanes whose output compound reads (LANES.md): the retro, the plan distill, friction and the cleanup. */
const SIGNAL_ROWS = [3, 4, 6, 7] as const;
const BUS_X = 364;

export const FridayLanesDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(FRIDAY_COPY, lang);
  const mondayY = laneY(copy.lanes.length) + 16;
  const mondayMid = mondayY + 22;
  const [first, ...rest] = SIGNAL_ROWS;
  return (
    <Diagram width={380} height={mondayY + 44 + 12} title={copy.title} description={copy.description}>
      {copy.lanes.map(([time, label, sub], i) => (
        <g key={time}>
          <Box x={20} y={laneY(i)} w={88} h={LANE_H} label={time} tone="muted" />
          <Box x={116} y={laneY(i)} w={232} h={LANE_H} label={label} sub={sub} />
        </g>
      ))}
      <Box x={20} y={mondayY} w={88} h={44} label={copy.monday[0]} tone="brand" />
      <Box x={116} y={mondayY} w={232} h={44} label={copy.monday[1]} sub={copy.monday[2]} tone="brand" />
      {rest.map((row) => (
        <line key={row} x1={348} y1={laneMid(row)} x2={BUS_X} y2={laneMid(row)} className="stroke-fd-muted-foreground [stroke-width:1.25] [stroke-dasharray:4_4]" />
      ))}
      <Arrow points={[[348, laneMid(first)], [BUS_X, laneMid(first)], [BUS_X, mondayMid], [350, mondayMid]]} dashed />
    </Diagram>
  );
};
