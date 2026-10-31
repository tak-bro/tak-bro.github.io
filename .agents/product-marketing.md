# Product Marketing Context

**Document version:** v2
**Last updated:** 2026-10-31

## Product Overview
**One-liner:** 코딩 에이전트가 쓴 코드도 팀이 믿을 수 있게 만드는 AI·DX 엔지니어 Tak 의 작업 방식 포트폴리오.
**What it does:** 이직을 준비하는 개발자 한 명이 AI 코딩 에이전트를 어떻게 쓰고 그 결과를 어떻게 통제하는지 보여 준다. 첫 화면에서 주장과 증거(훅이 실제로 막은 커밋, draft PR 에서 멈추는 흐름, hwip 폰 승인)를 보이고, 가이드는 깊이 보고 싶은 사람에게 셋업 전체를 보여 준다.
**Product category:** 개발자 포트폴리오(채용용 개인 사이트). 블로그도 아니고 문서 사이트도 아니다. 블로그와 가이드는 포트폴리오를 받치는 증거다.
**Product type:** 정적 개인 사이트(GitHub Pages, ko/en).
**Business model:** 없음. 전환은 채용 대화가 시작되는 것이다.

## Target Audience
**Target companies:** AI 코딩 도구를 이미 도입했거나 도입하려는 제품 회사·스타트업. 포지션은 AI 개발 생산성(DX): 팀의 에이전트 도입·개발 환경·워크플로우. 바탕은 2018년부터의 웹·React Native·Electron 실무.
**Decision-makers:** 채용 매니저(프론트엔드 리드·엔지니어링 매니저), CTO(작은 팀), 1차 스크리닝 리크루터.
**Primary use case:** 이력서 링크를 타고 들어온 사람이 5분 안에 "이 사람은 AI 를 써서 더 빨리 내놓으면서도 품질을 통제한다"고 판단한다.
**Jobs to be done:**
- 지원자가 말하는 "AI 잘 써요"를 증거로 확인한다.
- 팀에 들어왔을 때 AI 사용 방식을 팀 규칙으로 옮길 수 있는 사람인지 본다.
- 면접에서 물어볼 거리를 얻는다.
**Use cases:**
- 리크루터: 첫 화면 한 줄과 이력서만 보고 넘긴다.
- 리드: 원칙·워크플로우 가이드를 읽고 구조를 판단한다.
- 면접관: 사이트 내용을 면접 질문으로 쓴다.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| 리크루터 | 경력 연차·스택·연락 경로 | 기술 내용을 판단하기 어렵다 | 첫 화면에 누구·무엇·연락처, 이력서 한 번 클릭 |
| 프론트엔드 리드 | 코드 품질, 리뷰 부담, 팀 적합성 | AI 쓰는 지원자가 리뷰 안 된 코드를 쏟아낼까 걱정 | 사람이 멈추는 지점(draft PR·머지 직접)과 강제 장치(훅·게이트)를 보여 준다 |
| CTO·EM | 속도와 리스크의 균형, 팀에 퍼뜨릴 수 있는지 | AI 도입이 개인 기술로 끝나고 팀에 안 퍼진다 | 규칙을 한 곳에 두고 세 하네스에 강제하는 구조, `/team` 병렬 작업 |

## Problems & Pain Points
**Core problem:** 요즘 지원자 대부분이 "AI 를 잘 쓴다"고 쓰지만 그 말을 검증할 방법이 없다.
**Why alternatives fall short:**
- 이력서 한 줄("Copilot·Cursor 활용")은 증거가 아니다.
- 프롬프트 팁 블로그는 도구 사용법이지 엔지니어링 판단이 아니다.
- GitHub 잔디는 AI 가 만든 것인지, 통제됐는지 말해 주지 않는다.
**What it costs them:** 잘못 뽑으면 리뷰 부담이 늘고 사고가 난다. 못 알아보면 좋은 사람을 놓친다.
**Emotional tension:** "AI 로 빨라진 만큼 위험해진 건 아닌가" 하는 의심.

## Competitive Landscape
**Direct:** 다른 지원자의 포트폴리오 사이트 — 프로젝트 스크린샷 나열이라 일하는 방식이 안 보인다.
**Secondary:** 기술 블로그·발표 — 생각은 보이지만 실제 셋업과 결과물의 연결이 약하다.
**Indirect:** 이력서·LinkedIn 만 — 빠르지만 차별점이 한 줄로 끝난다.

## Differentiation
**Key differentiators:**
- 부탁이 아니라 구조: 권한 없음 → 하드 차단 → 훅 → 게이트 → 격리 → 요청 순서의 강제 사다리.
- 사람이 멈추는 지점이 정해져 있다: draft PR 에서 멈추고 머지는 직접 한다.
- 세 하네스(Claude Code·opencode·pi)를 한 설정으로 묶는다. herdr 로 동시에 굴린다.
- 직접 만든 도구: hwip(에이전트 질문을 폰으로 받아 답한다).
- 2018년부터 웹·React Native·Electron 실무.
**How we do it differently:** 원칙 설명이 아니라 실제 출력(막힌 커밋, 녹화 영상, 설정 파일)을 보여 준다.
**Why that's better:** 면접관이 말 대신 증거로 판단할 수 있다.
**Why customers choose us:** 미측정 — 아직 이 사이트를 통한 채용 대화가 없다.

## Objections
| Objection | Response |
|-----------|----------|
| 개인 셋업 자랑이지 팀 일은 다르다 | 규칙 정본 하나 + 훅 강제 + `/team` 병렬 구조는 팀 규칙으로 옮길 수 있다. 면접에서 팀 적용안을 설명한다 |
| agent-config 가 비공개라 확인할 수 없다 | 사이트 소스·hwip·가이드의 설정 발췌·훅 출력·녹화가 공개 증거다. 요청하면 면접에서 화면 공유 |
| AI 에 기대면 기본기가 약하지 않나 | 2018년부터의 실무 이력, 프로젝트, 이력서. 구조 자체가 기본기(리뷰·테스트·보안) 위에 서 있다 |

**Anti-persona:** AI 코딩 도구를 금지하는 조직. 블로그 독자(튜토리얼을 찾는 사람) — 이 사이트의 목적 대상이 아니다.

## Switching Dynamics
**Push:** 지원자 판별에 시간이 들고 "AI 활용"이라는 말이 변별력을 잃었다.
**Pull:** 5분 안에 주장·증거·연락처를 다 본다.
**Habit:** 이력서와 코딩 테스트만으로 판단한다.
**Anxiety:** 보여 주기용 셋업이고 실제 산출이 나은지는 모른다.

## Customer Language
**How they describe the problem:**
- 미수집 — 채용 담당자 인터뷰나 공고 문구를 모으면 채운다.
**How they describe us:**
- 미수집.
**Words to use:** 구조, 강제, 게이트, draft PR, 머지는 내가, 증거, 셋업, 하네스
**Words to avoid:** 혁신적인, 10배 생산성, AI 전문가, 프롬프트 엔지니어, 자동으로 다 해 준다
**Glossary:**
| Term | Meaning |
|------|---------|
| 하네스 | 에이전트를 돌리는 CLI(Claude Code·opencode·pi) |
| 훅 | 명령·커밋을 실행 전에 검사해 막는 스크립트 |
| 게이트 | 테스트 통과와 리뷰어 PASS 를 요구하는 슬라이스 단계 |
| herdr | 여러 에이전트를 pane 으로 띄우는 터미널 작업 공간 |
| hwip | 직접 만든 앱. 에이전트 질문을 폰 푸시로 받아 답한다 |

## Brand Voice
**Tone:** 담백하고 단정적. 자랑하지 않는다.
**Style:** 짧은 평서문, 결론 먼저. 주장 옆에 실제 출력.
**Personality:** 구조적, 정직한, 실용적, 조용히 자신 있는

## Proof Points
**Metrics:** 미측정 — 결과 지표(머지 뒤 결함, 게이트가 잡은 실제 결함, fix 루프 비용)는 agent-config 쪽에서 측정 중.
**Customers:** 해당 없음.
**Testimonials:** 없음.
**Value themes:**
| Theme | Proof |
|-------|-------|
| 부탁이 아니라 구조 | 홈 히어로의 실제로 막힌 커밋(c53c335), 6층 강제 사다리, 원칙 가이드 |
| 사람이 멈추는 지점 | draft PR 흐름, `/orch` 한 줄 → PR |
| 여러 에이전트 동시 운용 | herdr 녹화(가이드), `/team` |
| 만들어서 쓴다 | hwip(hwip.app) |
| 실무 경력 | 2018년부터 웹·RN·Electron, 이력서 |

## Goals
**Business goal:** 이직 — AI 도입에 진지한 팀의 프론트엔드 포지션 면접을 잡는다.
**Conversion action:** 이력서 열기 → LinkedIn 으로 연락(https://www.linkedin.com/in/hyungtak/). nav·히어로·푸터에 이력서와 LinkedIn 이 있다.
**Current metrics:** 미측정 — 방문 분석 도구 없음.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v2 (2026-10-31) — 포지션을 프론트엔드에서 AI·DX 로 바꿨다. 연락 경로를 LinkedIn 으로 정했다. hwip 케이스 스터디는 뒤로 미뤘다.
- v1 (2026-10-31) — Initial context: 사이트를 블로그·문서가 아닌 채용용 작업 방식 포트폴리오로 정의.
