import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: agent-config agent-skills/orch/SKILL.md (the declaration line; the M chain and the eng condition)
// and agent-skills/ship/SKILL.md (verify again, harvest before the commit, stop at a draft PR); merging is /land.
const CHAIN_COPY = {
  ko: {
    title: 'M 크기 작업은 선언 한 줄에서 draft PR 까지 이렇게 이어져요',
    description:
      '/orch 가 종류, 크기, 완료 기준과 재는 명령을 한 줄로 선언해요. 이어서 탐색, 플랜을 거치고, 슬라이스가 3개 이상이거나 새 모듈을 만들면 실행 관점 리뷰가 붙어요. 슬라이스 루프가 슬라이스마다 리뷰 게이트를 지나고, 브랜치 전체 리뷰(환경이 한 모델로 강제하지 않으면 opus·sonnet 두 번)와 ship 이 이어진 뒤 draft PR 에서 멈춰요. 머지는 사람이 /land 로 불러요.',
    steps: [
      ['/orch 선언 한 줄', '종류·크기·완료 기준·명령'],
      ['탐색', '아는 영역이면 건너뛰어요'],
      ['플랜', '슬라이스 큐·검증 계약'],
      ['실행 관점 리뷰', '슬라이스 3개 이상일 때'],
      ['슬라이스 루프', '슬라이스마다 리뷰 게이트'],
      ['브랜치 전체 리뷰', 'opus·sonnet 두 번'],
      ['ship', '검증 다시·노트·draft PR'],
    ],
    merge: ['머지', '사람이 /land 로 불러요'],
  },
  en: {
    title: 'An M-sized task runs from one declared line to a draft PR',
    description:
      '/orch declares the kind, the size, the done criterion and the command that measures it on one line. Then come explore and the plan, plus an engineering review when the queue has three or more slices or the plan makes a new module. The slice loop takes each slice through a review gate, then a full branch review (opus and sonnet, unless the environment forces one model) and ship follow, and the work stops at a draft PR. A person calls /land to merge.',
    steps: [
      ['/orch declares a line', 'kind, size, done, command'],
      ['Explore', 'skipped if the area is known'],
      ['Plan', 'slice queue and contract'],
      ['Engineering review', 'three or more slices'],
      ['Slice loop', 'a review gate per slice'],
      ['Full branch review', 'opus and sonnet'],
      ['ship', 'verify, notes, draft PR'],
    ],
    merge: ['Merge', 'a person calls /land'],
  },
};

const STEP = 58;
const H = 44;
const rowY = (i: number) => 12 + i * STEP;

export const OrchChainDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(CHAIN_COPY, lang);
  const last = copy.steps.length;
  return (
    <Diagram width={360} height={rowY(last) + H + 12} title={copy.title} description={copy.description}>
      {copy.steps.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[180, rowY(i - 1) + H], [180, rowY(i) - 2]]} /> : null}
          <Box x={40} y={rowY(i)} w={280} h={H} label={label} sub={sub} tone={i === 0 ? 'brand' : i === 3 ? 'muted' : 'default'} />
        </g>
      ))}
      <Arrow points={[[180, rowY(last - 1) + H], [180, rowY(last) - 2]]} dashed />
      <Box x={40} y={rowY(last)} w={280} h={H} label={copy.merge[0]} sub={copy.merge[1]} tone="muted" />
    </Diagram>
  );
};

// Source: agent-config agent-skills/03-review/SKILL.md and LOOP.md (verify, the finder, Critical or Important
// sends the slice back, at most 3 rounds, the same issue twice stops; PASS commits, ticks and moves on without asking).
const LOOP_COPY = {
  ko: {
    title: '슬라이스 하나는 검증과 리뷰 게이트를 통과해야 커밋돼요',
    description:
      '슬라이스 하나를 구현하면 플랜의 검증 명령을 돌리고, 리뷰어 서브에이전트가 finding 을 내요. Critical 이나 Important 가 있으면 FAIL 이라 고친 뒤 검증부터 다시 돌고 같은 리뷰어가 다시 봐요. 이 루프는 3회까지이고, 넘기거나 같은 문제가 두 번 연달아 나오면 멈추고 보고해요. PASS 면 커밋하고 큐에 체크한 뒤 묻지 않고 다음 슬라이스로 가요.',
    build: ['구현', '슬라이스 하나'],
    verify: ['검증 명령', '플랜의 CHECK'],
    gate: ['리뷰 게이트', '파인더가 finding'],
    pass: ['PASS', '커밋하고 체크해요'],
    fail: ['FAIL', '고쳐서 다시'],
    next: ['다음 슬라이스', '묻지 않고 넘어가요'],
    stop: ['멈추고 보고', '3회를 넘기면'],
  },
  en: {
    title: 'A slice is committed only after its checks and the review gate pass',
    description:
      'After one slice is built, the plan’s check commands run and a reviewer subagent returns findings. A Critical or Important finding is a FAIL: the code is fixed, the checks run again and the same reviewer looks again. The loop runs at most three rounds; past that, or when the same issue comes back twice in a row, it stops and reports. On PASS the slice is committed and ticked, and the next slice starts without asking.',
    build: ['Build', 'one slice'],
    verify: ['Checks', 'the plan’s CHECK lines'],
    gate: ['Review gate', 'a finder reports'],
    pass: ['PASS', 'commit and tick'],
    fail: ['FAIL', 'fix, run again'],
    next: ['Next slice', 'without asking'],
    stop: ['Stop, report', 'past three rounds'],
  },
};

export const SliceLoopDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(LOOP_COPY, lang);
  return (
    <Diagram width={360} height={398} title={copy.title} description={copy.description}>
      <Box x={60} y={12} w={240} h={52} label={copy.build[0]} sub={copy.build[1]} tone="brand" />
      <Arrow points={[[180, 64], [180, 84]]} />
      <Box x={60} y={86} w={240} h={52} label={copy.verify[0]} sub={copy.verify[1]} />
      <Arrow points={[[180, 138], [180, 158]]} />
      <Box x={60} y={160} w={240} h={52} label={copy.gate[0]} sub={copy.gate[1]} />
      <Arrow points={[[180, 212], [180, 228], [95, 228], [95, 248]]} />
      <Arrow points={[[180, 228], [265, 228], [265, 248]]} />
      <Box x={20} y={250} w={150} h={52} label={copy.pass[0]} sub={copy.pass[1]} />
      <Box x={190} y={250} w={150} h={52} label={copy.fail[0]} sub={copy.fail[1]} />
      <Arrow points={[[340, 276], [352, 276], [352, 112], [302, 112]]} dashed />
      <Arrow points={[[95, 302], [95, 332]]} />
      <Box x={20} y={334} w={150} h={52} label={copy.next[0]} sub={copy.next[1]} />
      <Arrow points={[[265, 302], [265, 332]]} dashed />
      <Box x={190} y={334} w={150} h={52} label={copy.stop[0]} sub={copy.stop[1]} tone="muted" />
    </Diagram>
  );
};
