# Review Verify-Fix Loop

`03-review` 에서 이슈 발견 시 자동 루프. 사용자 재지시 없이 진행. 루프 3요소(goal/max/budget) 정본:
`skills/_shared/loop-engineering.md`. **정지 조건 정본 = 아래 Exit 표.** 근거 = `docs/CONTRACT-EVIDENCE.md` § review-loop.

## Loop

1. 리뷰 완료 → Fix Checklist 생성 (Review Output 템플릿)
2. [Critical] 또는 [Important] 있으면 → 즉시 `/04-fix` (Fix Checklist 전달).
   - 예외 — **Axis-B Important(scope-creep)**: 코드 수정 아님. 사용자 게이트 — revert 또는 plan `## Decisions` 수락 기록.
3. 수정 후 재검증:
   - **결정적 체크 먼저**(Verification Commands) — 실패면 재리뷰 없이 fix 로 복귀.
   - 통과 시 **같은 파인더 재사용**(`stages/03-review.md` § After findings **Fail**: `SendMessage` 에 `- mode: re-review` +
     `- delta:`). 이전 판정·finding 목록은 다시 보내지 않는다. 폴백(agentId 없음·에러)은 fresh 재스폰 + Outcome 관측 행.
   - **동일 이슈 재발 판별**은 메인이 iteration 간 Fix Checklist 를 대조해서 한다.
4. 반복. **max 3 iterations — 슬라이스마다 독립.** 카운트는 plan `## Outcome` 에 `- fix-loop: <slice> iteration N/3`
   한 줄 **in-place 갱신**(compact 생존). 종료 시 이 행은 남기고(`/compound` 입력) review 행만 output-templates 최종 형식으로 갱신.

   **fix 라운드 경계마다 카운터를 명령으로 읽는다 — 모드 무관.** 경계 = 구현 verify red 재시도 · `04-fix` 진입 · 재리뷰.
   **올리는 곳은 셋** — red 재시도 · `04-fix` 진입 · 리턴 없이 죽은 재리뷰의 재스폰(죽은 라운드도 한 회, 근거: CONTRACT-EVIDENCE
   § review-loop-dead-round). 정상 재리뷰는 읽기 전용. plan 이 있으면:

   ```bash
   S=$(printf '%s' "$SLICE" | sed 's/[][\.*^$+?(){}|]/\\&/g')   # `04+05` 같은 병합 id 의 메타문자 이스케이프
   N=$(grep -E "fix-loop: (slice )?${S}([^0-9]|$)" "$PLAN" | grep -oiE 'iteration +[0-9]+' \
       | grep -oE '[0-9]+' | sort -n | tail -1)
   echo "fix-loop N=${N:-0}"
   ```

   `N` 이 3 이상이면 **고치지도 스폰하지도 않고** Exit 표 "3회 소진". `- plan: none` 단독 호출은 Output 리포트에서 같은 턴 안에서만
   센다. (근거: CONTRACT-EVIDENCE § review-loop-counter)

## Exit

| 조건 | 행동 |
|------|------|
| [Critical] 0 + [Important] 0 ([Nice-to-have]만 잔존 포함) | 슬라이스 통과 → 큐 남으면 **다음 frontier 자동 전진**(`02-implement`), 소진 시 루프 종료 — 마무리는 사용자 호출. `/orch` 경유면 같은 턴에 갈래의 마무리로 잇는다(`skills/orch/SKILL.md` Phase 1) |
| Axis-B Important(scope-creep) 잔존 | 자동루프 정지 → **사용자 게이트**(revert or `## Decisions` 수락). 해소 후 재리뷰. `/orch` 경유면 멈추지 않고 수락으로 기록(`skills/orch/SKILL.md` Phase 1) |
| 동일 이슈 2회 연속 재발 | 즉시 정지 — 접근 변경 or 보고 |
| 3회 소진 (리뷰 FAIL·verify red 합산) | 정지 + 보고 — 잔여 이슈·시도한 수정 전부. 판단은 사용자 |

`[b]` 는 위 Exit 표의 exit 이 아니다 — 구현 시점의 경계(코드 밖 권한)이지 리뷰 결과가 아니다. FAIL 을 `[b]` 로 빠져나가는 것은 금지,
그 경로는 skip 하나뿐.
