# Task Sizing

Don't run the full pipeline for every task. Skip stages based on task size.

## Size Guide

`/01-plan`~`/04-fix` = 무접두 라우터 — 레포 fw 자동 감지 후 해당 언어 팩으로 실행 (`skills/_shared/lang/detect.md`). 명시 필요 시(모노레포 혼재 등) 호출 인자로 (`/02-implement react`).

**사람이 여는 본선 입구는 `/01-plan`·`/02-implement`, 마무리 `/ship` 이다** — `/03-review`·`/04-fix` 는 앞 단계와 게이트가 부른다. 갈래를 고르기 싫으면 `/orch` 하나가
종류(add·change·fix·refine)와 크기를 선언하고 그 체인을 잇는다(`skills/orch/SKILL.md`).
**크기 tie-breaker**(정본 — `/orch` 의 크기 판정과 ship 전 `/security-scan` 이 이 목록을 쓴다) — 보안 트리거(인증·인가·사용자 입력·DB 쿼리·파일 경로·외부 API·암호·시크릿)나 공개 API·계약을
건드리면 파일 수와 무관하게 최소 M 이다(출처: ECC `orch-pipeline` Step 0, MIT). 아래 체인에 `04`가
안 보이는 건 누락이 아니라 **게이트가 부르기 때문**이다:
- `04-fix` ← `03-review` 게이트 FAIL 시 자동 (verify-fix 루프 — `review-loop.md`), 또는 `/ship` 게이트 2
  (로직 변경에 대응 테스트 0개일 때 — 빠진 테스트를 쓴다)

**테스트는 선택이 아니다.** `03-review` 의 결정적 테스트 동반 체크가 grep 으로 판정하고, 게이트가 FAIL 이면 루프가 돈다(심각도 표 정본 = `skills/_shared/stages/03-review.exec.md` 테스트 동반 체크, skip 판정 = `skills/_shared/tdd-first.md`).
크기가 단계를 고르되, 고른 체인 안의 게이트(`03-review`·테스트 동반 체크)는 건너뛰지 않는다.

### S (1-2 files) — One-line bug fix, small changes
```
/investigate → (고침) → /review → /ship
```
- 이 체인은 S `fix` 다. 크기별 체인은 여기가 정본이고, 종류가 바꾸는 델타(S `add`·`change`·`refine`)와 마무리 판정은 `skills/orch/SKILL.md` Phase 1 소유
- Skip explore, plan
- Small changes to code you already know
- **고치는 건 아무 경로나 된다** — `/04-fix`, `/02-implement`, 스킬 없이 "그냥 고쳐줘". 원인을
  찾은 쪽이 DEBUG 리포트를 만들고 **고친 쪽이 `## Resolution`을 채운다**
  (계약: `skills/investigate/SKILL.md` Phase 3.5)
- **세션 모델 하나, 전환 없음** — investigate 분석도 `/04-fix` 고침도 세션 모델(핀 정책 = `docs/DEVELOPMENT_GUIDE.md`).

### M (3-10 files) — General feature development
```
/explore → /01-plan (+ Slice Queue) → [/plan-eng-review — 슬라이스 3+·새 모듈일 때만]
  → 슬라이스 루프 ×N: [ /02-implement (한 슬라이스 — 메인이 직접 구현) → /03-review (파인더 스폰, 메인은 게이트) ⟲(04-fix(inline 직접)→verify green→재리뷰(같은 파인더 재사용), max 3) → 게이트 PASS → plan 큐 [x] → **다음 frontier 슬라이스로 자동 전진** ]
  → /ship          ← 마무리 게이트가 qa·04-fix를 신호 보고 라우팅
```
- **`/plan-eng-review` 는 조건부 — eng 조건(정본) = Slice Queue 3행 이상, 또는 새 모듈·서비스·패키지를 만든다.** 그때만 plan 뒤·implement 전에
  실행 렌즈(슬라이스 경계·failure mode·복잡도)로 플랜을 확정한다 — 큐가 클 때 코드 전에 잡는 게 싸다. 그 아래는 `03-review` 가 충분 —
  같은 diff 를 두 번 보지 않는다. plan Next 줄(`agent-skills/01-plan/SKILL.md` § Stop after planning)과 `/orch` 가 이 조건을 쓴다.
- **호출 단위 = 기능 전체, 구현 단위 = 수직 슬라이스**. `/02-implement` 한 번 = 큐 소진까지 완주 (슬라이스마다 리뷰 게이트는 그대로, 사람만 안 낀다). plan이 Slice Queue 생성, implement가 frontier 하나씩 처리. 계약: `skills/_shared/vertical-slices.md`
- **마무리 게이트 = `/ship` Phase 0** — 신호 3개(qa·04-fix 라우팅
  + 팀 org 설계문서면 `/promote` 제안만)와 임계값의 정본 = `skills/ship/SKILL.md`.
  1회 라우팅, 루프 아님. 신호 없으면 전부 스킵.
- **/simplify·/explain-diff는 게이트 밖** — 큐 소진 후 `/ship` 전에 이 순서로 직접. **`/simplify` 는 기능당 1회**(정리가 회귀를 만들 수 있고 `/review` 가 브랜치 전체를 다시 돈다. 근거: CONTRACT-EVIDENCE § task-sizing-simplify-once — `/orch` 가 어느 크기에서 자동으로 부르는지는 `skills/orch/SKILL.md` Phase 1 마무리). 슬라이스 사이에는 부르지 않는다. ship 게이트는 신호가 없어 부르지 않고, 스테이지 종료 안내가 한 줄을 제시만 한다(문구 = `output-templates.md` § 종료 안내). `/improve-architecture` 도 게이트 밖(L 전용).
- **슬라이스 간 자동 전진** (기본) — green이면 다음 슬라이스로 같은 턴에 이어감(한 줄 알림, 안 기다림). 사람은 슬라이스 사이 게이트 아님. 멈춤 사유는 `skills/_shared/review-loop.md` § Exit·§ 루프 밖 정지가 소유 — 여기서 다시 세지 않는다.
- `03-review` 이슈 발견 시 verify-fix 루프 자동 진입: `04-fix → 재리뷰` (상한·카운터 = `skills/_shared/review-loop.md`)
- 마무리는 전부 큐 소진 후 기능 레벨 1회 (슬라이스마다 아님)
- **`/review` 는 03-review 를 안 거친 diff 와 M 이상의 마무리에** — 단독 `/review` 는 큐 전 슬라이스가 게이트 PASS 로 커밋됐으면 같은 코드를
  통짜로 다시 보는 것이라 건너뛴다(판정 = `skills/review/SKILL.md` § 1 "이미 게이트됨"). pi 구현·수동 커밋처럼
  슬라이스 리뷰 기록이 없는 브랜치, 그리고 `/simplify` 가 게이트 뒤에 바꾼 diff 가 `/review` 의 자리다. `/orch` 는 M 이상이면 큐 소진 뒤 `/review --full` 을 한 번 돌고(슬라이스를 가로지르는 문제), S `add`·`change` 는 `hooks/s-gate.sh` PASS 기록으로 판정한다 — 정본 `skills/orch/SKILL.md` Phase 1. `/tech-debt`·`/compound` 도 ship 게이트 밖 — 주기 레인
  (`docs/LANES.md` `friction.biweekly`·`compound.monday`)이 부른다. plan Outcome 의 `fix-loop:` 행이 compound 의 입력.
- TDD skip 조건 = `skills/_shared/tdd-first.md` § Skip 조건 — 주장이 아니라 확인된 것만
- **결정은 AI 가, 사용자에겐 못 정하는 것만** — `/01-plan` Phase 2.5 가 열린 결정을 스스로 닫고(`Decisions` 에 근거),
  선호·비가역·스코프·상충 선례만 grilling 형식으로 묻는다(보통 0~3개). 굳은 용어·결정은 CONTEXT.md/ADR inline.
- **/prototype 선택** (plan 전, 설계 질문이 미해결일 때만): 말로 안 끝나는 질문 —
  "이 상태 모델 맞나" / "어떻게 보여야 하나" — 을 버리는 코드로 끝낸다. 답만 plan에 접고
  코드는 throwaway 브랜치. 질문이 없으면 스킵 (프로토타입은 만들 게 정해졌을 때 쓰는 게 아니다)

### L (10+ files) — Large-scale features, refactoring
```
/explore → /plan-ceo-review → /01-plan (+ Slice Queue) → [/plan-eng-review — 슬라이스 3+·새 모듈일 때만]
  → 슬라이스 루프 ×N: [ /02-implement → /03-review ⟲(04-fix→verify green→재리뷰, max 3) → 게이트 PASS → plan 큐 [x] → **다음 frontier 슬라이스로 자동 전진** ]
  → /improve-architecture(권장) → /ship   ← 게이트가 qa·04-fix 라우팅
```
- 큐 분해·자동 전진·verify-fix 루프 = **M과 동일** (위 M 절). L의 델타만 아래:
- **전 구간 세션 모델, 전환·clear 없이 진행** — 구현도 메인이 직접 하고 파인더만 스폰하므로 모델을 바꿀 이유가 없다(핀 정책 = `docs/DEVELOPMENT_GUIDE.md`).
- **pi 가 구현자면** `/01-plan` 까지 여기서, 슬라이스 소진은 pi `/skill:02-implement`(계약 = `pi/GUIDE.md` § 2.3, 기동 = 사람이 `/pi-implement`), 이 세션은 `/review`·`/ship` 과 게이트 판정만 — 슬라이스 결과는 `_shared/slice-results.md`. 세션 오픈 고정 비용 때문에 플랜 한 번에 슬라이스 여러 개를 싣는다(근거: CONTRACT-EVIDENCE § task-sizing-pi-session-cost).
- **/prototype 선택** (M과 동일 — plan 전, 설계 질문 미해결 시). L에서는 특히 슬라이스 분해
  **전에** 쓴다: 상태 모델/화면 구조가 안 정해진 채 큐를 짜면 슬라이스 경계가 틀린다
- 렌즈 위치: `/plan-ceo-review` 는 plan **전**(스코프 잠금), `/plan-design-review` 는 설계 결정이
  미해결일 때 ceo 뒤·plan 전, `/plan-eng-review` 는 plan **뒤**(M 절의 eng 조건)

### XL (경로가 안 보임) — 크기가 아니라 **안개**가 기준
```
/explore → /grilling (+ /prototype) 로 결정 해소 → 안개 소진
  → /01-plan (+ Slice Queue) → 이후 L과 동일
```
- **진입 조건은 파일 수가 아니다.** 한 세션에 안 들어가고 **뭘 결정해야 할지부터 모를 때**만.
  안 들어가지만 만들 게 정해졌으면 그건 L → 바로 `/01-plan`.
- 첫 grilling에서 **안개가 안 나오면 즉시 중단** → `/01-plan`.
- 결정은 **답할 질문**, Slice Queue 는 **만들 슬라이스** — 순차지 대체 아님, 안개가 걷혀야 큐를 짤 수 있다.
  여러 세션에 걸치면 같은 세션을 resume 한다. **여기는 사람이 루프 안에 있다.**

## 외부 의존 (footnote)
- `/simplify` = 내장 `/simplify` 의 로컬 오버라이드(`skills/simplify/SKILL.md`). `/simplify` = 리뷰+적용 · `code-simplicity-reviewer` = 리포트 전용.
