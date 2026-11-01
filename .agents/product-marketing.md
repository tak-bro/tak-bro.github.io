# Product Marketing Context

**Document version:** v4
**Last updated:** 2026-11-01

## Product Overview
**One-liner:** 코딩 에이전트 하네스를 어떻게 만들고 쓰는지 정리한 가이드. Tak(진형탁)의 개인 사이트.
**What it does:** Claude Code·opencode·pi 에 붙인 규칙·훅·스킬과 그 설정을 셋업 가이드로 보인다. 홈은 이름·두 문장 소개·가이드 목록과, 이 사이트를 고친 실제 Claude Code 세션을 재생하는 터미널이고, 설정의 근거와 다이어그램은 가이드에 있다.
**Product category:** 개인 사이트(셋업 가이드). 채용 포트폴리오가 아니다. 채용 맥락은 nav 의 이력서와 푸터의 LinkedIn 이 맡는다.
**Product type:** 정적 개인 사이트(GitHub Pages, ko/en).
**Business model:** 없음.

## Target Audience
**Primary:** 코딩 에이전트를 쓰는 개발자 — 남의 하네스가 어떻게 생겼고 실제로 어떻게 일하는지 보고 싶은 사람.
**Secondary:** 이력서·LinkedIn 을 보고 들른 사람 — 이 사람이 무슨 일을 하는지 보고 싶은 사람.
**Jobs to be done:**
- 규칙·훅·게이트를 실제로 어떻게 거는지, 실제 출력으로 본다.
- 셋업 가이드에서 설정 원문과 그 이유를 읽는다.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| 에이전트 쓰는 개발자 | 규칙이 실제로 지켜지는지, 세 하네스를 어떻게 같이 쓰는지 | 팁 글은 많지만 실제 셋업과 결과가 이어진 기록이 드물다 | 설정 원문·다이어그램·실제 출력이 붙은 가이드 |
| 이력서를 보고 온 사람 | 무슨 일을 하는 사람인지 | 이력서 한 줄로는 일하는 방식이 안 보인다 | 첫 화면의 주제 한 줄과 가이드, nav 의 이력서 |

## Problems & Pain Points
**Core problem:** 코딩 에이전트 사용기는 대부분 프롬프트 팁이거나 도구 소개라서, 규칙을 어떻게 강제하고 그 결과가 어땠는지가 빠져 있다.
**What this site does instead:** 하네스(규칙·훅·스킬)의 설정 원문과 그 이유를 가이드로 둔다. 주장 옆에 실제 출력을 둔다.

## Differentiation
- 규칙은 부탁하고, 훅은 막는다: 어기면 안 되는 것은 훅으로 막는다(막힌 뒤 고쳐서 들어간 커밋 c53c335).
- 에이전트 작업은 draft PR 에서 멈추고, 방향 판단은 사람이 한다.
- 세 하네스(Claude Code·opencode·pi)가 규칙 파일 하나를 읽는다.
- 직접 만든 도구: hwip, aicommit2, pi-statusline, 그리고 claude-watch 를 포크해 고친 tak-cc-statusline.
- 2018년부터 웹·React Native·Electron 실무.

## Objections
| Objection | Response |
|-----------|----------|
| agent-config 가 비공개라 확인할 수 없다 | 가이드의 설정 발췌와 실제 출력, 공개 도구 레포가 공개 증거다 |
| 개인 셋업 기록이 나한테 무슨 소용인가 | 규칙 한 곳·훅·draft PR 멈춤은 다른 셋업에도 옮길 수 있는 모양이다. 가이드에 이유까지 적었다 |

**Anti-persona:** 튜토리얼이나 프롬프트 모음을 찾는 사람.

## Customer Language
**Words to use:** 하네스, 규칙, 훅, 게이트, draft PR, 실제 출력
**Words to avoid:** 혁신적인, 10배 생산성, AI 전문가, 프롬프트 엔지니어, 자동으로 다 해 준다
**Glossary:**
| Term | Meaning |
|------|---------|
| 하네스 | 에이전트를 돌리는 CLI(Claude Code·opencode·pi)와 거기 붙인 규칙·훅·스킬 |
| 훅 | 명령·커밋을 실행 전에 검사해 막는 스크립트 |
| 게이트 | 테스트 통과와 리뷰어 PASS 를 요구하는 슬라이스 단계 |
| herdr | 여러 에이전트를 pane 으로 띄우는 터미널 작업 공간 |
| hwip | 직접 만든 앱. 에이전트 질문을 한 수신함에 모아 폰에서도 답한다 |

## Brand Voice
**Tone:** 담백하고 친절하게. 자랑하지 않는다.
**Style:** 한국어는 해요체가 기본이고 격식 있는 서술은 습니다체(평서형 `-다` 종결은 쓰지 않는다), 결론 먼저. 주장 옆에 실제 출력. 줄인 출력은 "줄여 옮김"이라고 적는다.
**Personality:** 구조적, 정직한, 실용적

## Proof Points
**Metrics:** 미측정 — 수치는 쓰지 않는다.
**Customers · Testimonials:** 없음.
**Value themes:**
| Theme | Proof |
|-------|-------|
| 규칙은 부탁, 훅은 강제 | 원칙·에이전트 설정 가이드(훅이 막은 커밋 출력) |
| 사람이 멈추는 지점 | 워크플로우 가이드(/orch 가 draft PR 에서 멈춤) |
| 규칙 한 곳, 세 하네스 | 에이전트 설정 가이드 |

## Goals
**Goal:** 가이드를 하나 연 방문자가 설정 원문과 그 이유, 실제 출력을 본다.
**Secondary:** 이력서를 보고 온 사람이 nav 에서 이력서를, 푸터에서 LinkedIn(https://www.linkedin.com/in/hyungtak/)을 찾는다.
**Current metrics:** 미측정 — 방문 분석 도구 없음.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v4 (2026-11-01) — 글·프로젝트를 없애고 가이드만 남겼다(사용자 지시 "글, 프로젝트 없애"). 한국어 문체를 해요체·습니다체로 바꿨다(사용자 지시).
- v3 (2026-10-31) — 주제를 "코딩 에이전트 하네스를 만들고, 그걸로 일한 기록"으로 바꿨다. 채용 포트폴리오 홈은 사용자가 "주제를 모르겠다"고 판정해 버렸다(SITE-BRIEF §7). 독자를 에이전트 쓰는 개발자로 옮겼다.
- v2 (2026-10-31) — 포지션을 프론트엔드에서 AI·DX 로 바꿨다. 연락 경로를 LinkedIn 으로 정했다. hwip 케이스 스터디는 뒤로 미뤘다.
- v1 (2026-10-31) — Initial context: 사이트를 블로그·문서가 아닌 채용용 작업 방식 포트폴리오로 정의.
