# Site brief — UI 재설계용

이 사이트를 새로 디자인하는 세션이 처음 읽는 문서다. **무엇을 만드는지·누구를 위한 것인지·바꾸면 안 되는 것**을 정한다.
화면 모양은 정하지 않는다. 그건 재설계 세션이 정한다.

- 포지셔닝 정본 = [`.agents/product-marketing.md`](.agents/product-marketing.md)(독자·쓸 말/피할 말). 이 문서와 어긋나면 그쪽이 맞다.
- 지금 빌드의 디자인 기록 = [`DESIGN.md`](DESIGN.md)(하네스 기록 사이트, 2026-10-31). 다시 갈아엎으면 이 문서를 입력으로 DESIGN.md 를 새로 쓴다.

## 1. 한 줄 정의

**코딩 에이전트 하네스를 만들고, 그걸로 일한 기록이다.** Tak(진형탁)이 Claude Code·opencode·pi 에 붙인 규칙·훅·스킬과, 그 하네스로 실제로 일한 노트를 모은다.

- 2019년 사이트의 구조(누구 한 문단 + 글 + 프로젝트 + 링크)를 살리고, 내용을 하네스로 바꿨다.
- 홈 문장은 채용 담당자에게 말을 걸지 않는다. 채용 맥락은 nav 의 이력서와 푸터의 LinkedIn 이 맡는다.
- 성공 = 방문자가 글이나 프로젝트를 하나 열어 실제 출력을 본다.

## 2. 누가 와서 무엇을 보나

| 방문자 | 보는 것 | 첫 화면에서 얻어야 할 것 |
|---|---|---|
| 코딩 에이전트를 쓰는 개발자 | 남의 하네스가 어떻게 생겼고 실제로 어떻게 일하는지 | 이 사이트의 주제, 최근 글 제목 |
| 이력서·LinkedIn 을 보고 온 사람 | 이 사람이 무슨 일을 하는지 | 누구인지, 주제 한 줄, 이력서 링크 |

## 3. 메시지 위계

1. **누구** — Tak(진형탁). 2018년부터 웹·React Native·Electron.
2. **무엇** — 주제 한 줄: "코딩 에이전트 하네스를 만들고, 그걸로 일한 기록".
3. **최근 글** — 첫 화면 안에 첫 행이 보인다.
4. **프로젝트** — 하네스 쪽 결과물. 출력 조각 하나.
5. **깊이** — 셋업 가이드 6편(원하는 사람만).

## 4. 페이지와 동선

| 경로 | 역할 | 메모 |
|---|---|---|
| `/` · `/en` | 이름, 주제, 최근 글 3편, 프로젝트, 가이드 | 글·프로젝트는 한국어라 en 홈은 섹션 설명에 그렇게 적는다 |
| `/blog`, `/blog/<slug>` | 에이전트 노트(한국어만) | 목록은 2026년 이후 글만(`LISTED_SINCE`). 옛 글은 각 주소로만 열린다 |
| `/projects`, `/projects/<name>` | 하네스 쪽 프로젝트 5개(한국어만) | 목록은 `type: "agent"` 만. 옛 프로젝트 6개(`type: "side"`)는 각 주소로만 열린다 |
| `/docs/*` · `/en/docs/*` | 셋업 가이드 6편 + 소개(fumadocs) | 레이아웃은 fumadocs 유지 |
| `/assets/resume.pdf` · `/assets/resume_eng.pdf` | 이력서 | URL 고정(외부에서 링크됨) |
| `/404` | 없는 페이지 | `PageHeader` 로 시작 |

nav = 글 · 프로젝트 · 가이드 · 이력서 · GitHub(`app/lib/layout.shared.tsx`, 테스트 `app/lib/__tests__/layout.test.ts`). LinkedIn 은 홈 푸터.

## 5. 쓸 수 있는 실제 재료

새로 지어내지 않는다. 고객·추천사·수치·로고는 없다(지어내면 안 된다).

**연락·신원**
- LinkedIn `https://www.linkedin.com/in/hyungtak/`, GitHub `https://github.com/tak-bro`, hwip `https://hwip.app`, 사이트 소스 레포.
- 상수 정본 = `app/lib/shared.ts`(`LINKEDIN_URL`, `GITHUB_URL`, `RESUME_HREF`), 언어별 이력서 = `resumeHref(lang)`(`app/lib/i18n.ts`).

**실제 출력** — 글과 프로젝트 페이지에 있다
- 훅이 실제로 막은 커밋 출력(`hooks/commit-convention.py`, exit 2) — 글 「훅이 에이전트의 커밋을 막았다」, 프로젝트 agent-config.
- `/orch` 실행의 플랜 Outcome 줄 — 글 「에이전트 작업은 draft PR 에서 멈춘다」.
- 규칙 한 곳과 세 하네스 표 — 글 「규칙 파일 하나를 세 하네스가 읽는다」.
- statusline 출력(tak-cc-statusline·pi-statusline README), aicommit2 출력.
- herdr 녹화 `public/assets/video/herdr.mp4` + 포스터 `herdr-poster.webp`. **사용자 결정: 영상은 `/docs/herdr` 에만 둔다. 홈에 넣지 않는다.**

**가이드 6편**(`content/docs/meta.json` 순서): 원칙 · 에이전트 설정 · 워크플로우 · 플러그인·MCP · Herdr · 키맵. 각 ko/en.

**프로젝트**: `content/projects/` 의 `type: "agent"` 5개(hwip, aicommit2, tak-cc-statusline, pi-statusline, agent-config). 옛 6개(audiga, buzzler, puton, smart, stock_checker, suji)는 스크린샷 `public/assets/img/projects/` 와 함께 주소만 남는다.

## 6. 고정 조건(바꾸지 않는다)

**스택·빌드**
- React Router 7 + fumadocs, 전부 prerender 하는 정적 사이트, GitHub Pages. Tailwind 4, Pretendard.
- 완료 판정 = `pnpm check` 마지막 줄 `check: ok`(sensitive → typecheck → test → build → 링크·이미지 → 필수 파일).
- 배포(Pages)는 사용자가 정한다. 작업은 draft PR 까지.

**내용**
- 회사 이름을 넣지 않는다. `pnpm check:sensitive` 에 예외를 더하지 말고 내용을 고친다.
- agent-config 레포는 링크하지 않는다. 소개와 발췌로만 보인다(`content/snippets/`, `just sync-configs`).
- ko 기본, en 은 `/en`. 홈과 docs 는 두 언어 모두. blog·projects 는 한국어만.
- 글과 프로젝트의 사실은 1차 출처(README, 플랜 Outcome, 훅 코드, 가이드)에 있는 것만. 출력은 실제 출력이고, 줄였으면 "줄여 옮김"이라고 적는다.
- 쓸 말: 하네스, 규칙, 훅, 게이트, draft PR, 기록. 피할 말: 혁신적인, 10배 생산성, AI 전문가, 프롬프트 엔지니어, 자동으로 다 해 준다.
- 톤: 담백하고 단정적. 짧은 평서문, 결론 먼저. 주장 옆에 실제 출력.

**품질**
- 모션 라이브러리 금지(GSAP·Lenis 없음). `prefers-reduced-motion` 에서 모션은 꺼지고, 스크립트 없이도 숨는 내용이 없다.
- 키보드 동선: skip link(`app/root.tsx`), 포커스 표시, 새 탭 링크에 표시.
- 390px 폰과 1440 데스크톱(ko·en)에서 첫 화면이 이름·주제·최근 글 첫 행을 보인다.

## 7. 이미 버린 방향

같은 데로 돌아가지 않는다.

1. **docs 랜딩**(자체 점검 패널) — 가이드 목차로 읽혔다.
2. **긴 철학 페이지** — 에세이로 읽혔다.
3. **셋업 쇼케이스**(`064d9f6`–`9c8335f`) — "블로그야 독스야?" 소리를 들었다. 도구마다 카드 한 장, 눌러 보는 6층 인터랙션, 가이드 카드 그리드가 "내 셋업 구경"으로 읽혔다. 기능 이름으로 묶은 카드, 도구 칩, 인터랙티브 사다리로 돌아가지 않는다.
4. **채용 포트폴리오 홈**(`ab6fdec`, draft PR #20 에서 교체) — 홈 전체가 채용 담당자에게 말을 걸었다: 헤드라인 "에이전트가 쓴 코드도 팀이 믿을 수 있게", 채용자가 물을 질문 세 개와 실제 출력, "팀에 그대로 옮길 수 있는 것", "채용 이야기는 LinkedIn 으로" 연락 섹션. 사용자 판정은 "주제를 모르겠다"였다. 피치 섹션(질문·팀·연락)으로 돌아가지 않는다. 그 세 출력은 글 세 편이 됐다.

## 8. 지금 정한 것

2026-10-31 주제 전환에서 기본값으로 정했다. draft PR 에서 바꿀 수 있다.

- 헤드라인 = 주제 한 줄 — "코딩 에이전트 하네스를 만들고, 그걸로 일한 기록" / "Building coding-agent harnesses, and working with them". 이름은 그 위 작은 줄.
- 홈 출력 조각은 하나(tak-cc-statusline). 나머지 출력은 글과 프로젝트 페이지에 있다.
- 블로그 글은 한국어만. en 홈은 섹션 설명에 "Written in Korean" 을 적는다.

정하지 않고 미룬 것(사용자 결정):
- hwip 케이스 스터디 — "나중에".
- 글 배포(LinkedIn·GeekNews) — 미착수.
- 효과 수치(머지 뒤 결함 등) — 미측정. 측정되기 전엔 수치를 쓰지 않는다.

## 9. 완료 기준

- 첫 화면에서 이름·주제 한 줄·최근 글 첫 행이 보인다(데스크톱 1440, 폰 390, ko·en).
- 글과 프로젝트의 출력은 실제 출력이고, 지어낸 고객·수치·추천사가 없다.
- `pnpm check` → `check: ok`, 페이지 에러 0, reduced motion 에서 정지.
- 다시 갈아엎으면 `DESIGN.md` 를 새로 쓰고, 이 문서 §7 에 지금 빌드를 "버린 방향"으로 남긴다.
