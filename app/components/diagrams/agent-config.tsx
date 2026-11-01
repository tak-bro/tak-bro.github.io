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

// Source: agent-config claude/hooks/commit-convention.py (a PreToolUse hook on Bash; block_trailer prints the
// reason to stderr and exits 2) and the Claude Code hook contract it relies on (exit 2 cancels the call).
const HOOK_COPY = {
  ko: {
    title: '툴 호출 앞의 훅이 exit 2 로 끝나면 그 호출은 실행되지 않아요',
    description:
      '에이전트가 git commit 같은 툴 호출을 내면, 실행 전에 PreToolUse 훅이 먼저 돌아요. 훅이 exit 0 으로 끝나면 호출이 그대로 실행돼요. exit 2 로 끝나면 호출은 실행되지 않고, 훅이 적은 이유가 에이전트에게 돌아가요. 에이전트는 그 이유를 읽고 고쳐서 다시 호출해요.',
    call: '에이전트의 툴 호출',
    hook: '훅 (PreToolUse)',
    pass: '그대로 실행돼요',
    block: '실행하지 않아요',
    reason: '이유를 읽어요',
    reasonSub: '고쳐서 다시 호출해요',
  },
  en: {
    title: 'When the hook before a tool call exits 2, the call never runs',
    description:
      'When the agent makes a tool call such as git commit, a PreToolUse hook runs first. If the hook exits 0, the call runs as asked. If it exits 2, the call does not run and the reason the hook printed goes back to the agent, which reads it, fixes the call and tries again.',
    call: 'Agent tool call',
    hook: 'Hook (PreToolUse)',
    pass: 'runs as asked',
    block: 'never runs',
    reason: 'Agent reads why',
    reasonSub: 'fixes, calls again',
  },
};

export const HookGateDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(HOOK_COPY, lang);
  return (
    <Diagram width={360} height={346} title={copy.title} description={copy.description}>
      <Box x={60} y={12} w={240} h={56} label={copy.call} sub="git commit …" mono tone="brand" />
      <Arrow points={[[180, 68], [180, 94]]} />
      <Box x={60} y={96} w={240} h={56} label={copy.hook} sub="commit-convention.py" mono />
      <Arrow points={[[180, 152], [180, 168], [95, 168], [95, 190]]} />
      <Arrow points={[[180, 168], [265, 168], [265, 190]]} />
      <Box x={20} y={192} w={150} h={56} label="exit 0" sub={copy.pass} />
      <Box x={190} y={192} w={150} h={56} label="exit 2" sub={copy.block} tone="muted" />
      <Arrow points={[[265, 248], [265, 274]]} />
      <Box x={190} y={276} w={150} h={56} label={copy.reason} sub={copy.reasonSub} />
      <Arrow points={[[340, 304], [352, 304], [352, 40], [302, 40]]} dashed />
    </Diagram>
  );
};

// Source: agent-config claude/skills/review/SKILL.md § 교차 모델 파인더 (the fork runs reviewer as pinned, opus;
// the main session spawns the same reviewer with model: sonnet and merges both returns) and
// claude/agents/reviewer.md (model: opus).
const CROSS_COPY = {
  ko: {
    title: '브랜치 전체 리뷰는 같은 리뷰어를 두 모델로 띄워 결과를 합쳐요',
    description:
      '/review --full 을 부르면 reviewer 서브에이전트가 정의에 고정된 opus 로 한 번, 같은 지시서를 받아 호출에서 sonnet 으로 바꾼 채 한 번 돌아요. 메인 세션이 두 리턴을 합쳐 판정해요. 한 모델이 놓친 결함을 다른 모델이 잡게 하려는 거예요. 환경이 한 모델로 강제하면 한쪽만 돌아요.',
    fork: 'opus · 정의의 고정값',
    spawn: 'sonnet · 호출에서 바꿈',
    merge: '메인 세션이 합쳐요',
    mergeSub: '두 리턴으로 판정 하나',
  },
  en: {
    title: 'A full branch review runs one reviewer on two models and merges the results',
    description:
      '/review --full runs the reviewer subagent once on opus, as its definition pins, and once with the same brief on sonnet, set for that call. The main session merges the two returns into one verdict, so a defect one model misses can be caught by the other. When the environment forces one model, only one runs.',
    fork: 'opus, as pinned',
    spawn: 'sonnet, per call',
    merge: 'Main session merges',
    mergeSub: 'one verdict from both',
  },
};

export const CrossModelReviewDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(CROSS_COPY, lang);
  return (
    <Diagram width={360} height={264} title={copy.title} description={copy.description}>
      <Box x={60} y={12} w={240} h={52} label="/review --full" tone="brand" />
      <Arrow points={[[180, 64], [180, 80], [95, 80], [95, 102]]} />
      <Arrow points={[[180, 80], [265, 80], [265, 102]]} />
      <Box x={20} y={104} w={150} h={56} label="reviewer" sub={copy.fork} />
      <Box x={190} y={104} w={150} h={56} label="reviewer" sub={copy.spawn} />
      <Arrow points={[[95, 160], [95, 198]]} />
      <Arrow points={[[265, 160], [265, 198]]} />
      <Box x={20} y={200} w={320} h={52} label={copy.merge} sub={copy.mergeSub} />
    </Diagram>
  );
};
