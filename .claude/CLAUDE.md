# CLAUDE.md - 메인 가이드

> **⚠️ 최우선 규칙**: Context Compact 발생 시 반드시 이 문서를 먼저 읽고 아래 복구 프로토콜을 따르세요.

## 🚨 Context Compact 복구 프로토콜

### Context Compact란?
대화가 길어져 토큰 한계에 도달하면 이전 대화가 요약되고 컨텍스트가 재설정됩니다.

### 즉시 실행할 복구 단계

#### 1️⃣ 필수 문서 읽기 (순서대로)
```bash
1. .claude/context/current.md        # 현재 작업 상태
2. .claude/context/index.md           # 전체 문서 생성 이력
3. 관련 numbered 문서들              # current.md에 명시된 활성 문서
```

#### 2️⃣ 상태 검증
- [ ] current.md의 작업 위치와 실제 코드 일치 확인
- [ ] 진행 중이던 하위 작업 완료 여부 확인
- [ ] 차단 요소나 대기 중인 결정사항 확인

#### 3️⃣ 작업 재개
- current.md에 문서화된 정확한 지점에서 재개
- 새 세션 정보로 current.md 업데이트
- 문서화된 계획과 할 일을 따라 진행

### ❌ 절대 금지사항
- 문서를 읽지 않고 작업 시작
- 사용자에게 "어디까지 했나요?" 질문
- 문서화된 계획 무시하고 새로운 방향 시작

## 📁 디렉토리 구조

```
.claude/
├── CLAUDE.md              # 이 파일 - 메인 가이드
├── context/              # 현재 상태 및 히스토리
│   ├── CLAUDE.md        # 컨텍스트 관리 가이드
│   ├── current.md       # 🔴 실시간 작업 상태
│   ├── index.md         # Global numbering 파일 생성 순서
│   └── dialog/          # 대화 로그 (timestamp_dialog.md)
├── docs/                # 모든 문서 디렉토리
│   ├── plan/           # 계획 문서
│   ├── todo/           # 할 일 문서
│   ├── review/         # 검토 문서
│   ├── structure/      # 구조 문서화
│   ├── DKB/            # 도메인 지식 베이스
│   ├── lexicon/        # 용어 사전
│   └── dev_action/     # 개발자 액션
├── scripts/             # 자동화 스크립트
└── templates/           # 문서 템플릿
```

## 🔢 브랜치 기반 Global Numbering 체계

### 파일명 형식
```
{branch}_{number}_{name}_{type}.md
예: feature-auth_001_jwt_implementation_todo.md
예: master_003_database_structure.md
```

### 브랜치 이름 정규화
- 슬래시(/) → 하이픈(-) 변환
- 소문자 변환
- 예: `feature/auth-system` → `feature-auth-system`

### 번호 할당 규칙
- **브랜치별 독립 번호**: 각 브랜치는 001부터 시작
- **브랜치 내 순차**: 해당 브랜치 내에서만 순차 증가
- **형식**: 3자리 숫자 (001-999)
- **Merge 안전**: 브랜치 prefix로 충돌 방지

### 번호 관리
- `.claude/context/index.md`에 브랜치별 섹션으로 관리
- 생성 날짜/시간과 함께 기록
- 한 번 할당된 번호는 해당 브랜치 내에서 재사용 금지
- Merge 시 각 브랜치 섹션 독립적으로 보존

### 예시
```
master_001_initial_setup_plan.md (in docs/plan/)
master_002_authentication_todo.md (in docs/todo/)
feature-auth_001_jwt_implementation_todo.md (in docs/todo/)
feature-auth_002_session_knowledge.md (in docs/DKB/)
```

### 📌 문서 생성 방법
**스크립트 사용 (권장):**
```bash
./.claude/scripts/claude-new-doc.sh plan "authentication_system"
# 자동으로 현재 브랜치 감지, 번호 할당, index.md 업데이트
```

**수동 생성 시:**
```
⚠️ 새 numbered 문서 생성 전 반드시:
1. .claude/context/index.md 열기
2. 현재 브랜치 섹션에서 "다음 번호" 확인
3. {branch}_{number}_{name}_{type}.md 형식으로 문서 생성
4. index.md 브랜치 섹션에 즉시 기록
5. current.md 업데이트
```

### 제외 파일
- `current.md` - 번호 없음, 항상 최신 상태
- `dialog/*.md` - timestamp 형식 사용
- `CLAUDE.md` 파일들 - 가이드 문서

## ⚡ 핵심 워크플로우

### 1. 작업 시작
1. `.claude/context/current.md` 확인/생성
2. 계획 수립 → numbered plan 문서 생성
3. 할 일 작성 → numbered todo 문서 생성

### 2. 🔴 작업 진행 - 최소 단위 실시간 동기화

**⚠️ 매 원자적 작업(함수 1개, 파일 1개, 버그 1개) 완료 즉시:**

| 작업 유형 | 즉시 업데이트할 문서 | 업데이트 내용 |
|----------|-------------------|--------------|
| **모든 작업** | `context/current.md` | 작업 위치, 다음 작업 |
| **파일 변경** | `docs/structure/` 문서 | 생성/수정/삭제 |
| **패턴 발견** | `docs/DKB/` 새 문서 | 해결책, 소요시간 |
| **용어 발견** | `docs/lexicon/` 문서 | 정의, 사용처 |
| **차단 발생** | `docs/dev_action/` 새 문서 | 필요 액션 |
| **할일 완료** | `docs/todo/` 문서 | 체크박스, 진행상태 |

```
⚠️ 동기화 순서 (절대 변경 금지):
1. 작업 수행
2. 즉시 문서 업데이트 (건너뛰기 금지!)
3. 다음 작업 시작
```

### 3. 작업 완료
1. Review 문서 생성
2. 모든 문서 최종 동기화
3. current.md 완료 상태 업데이트
4. context/index.md 업데이트

## 📚 DKB/Lexicon 자동 생성 트리거

**⚠️ 아래 조건 발생 시 즉시 해당 문서를 생성하세요. 사용자 지시 없이도 자동으로!**

### DKB 즉시 생성 조건
| 트리거 | 설명 | 예시 |
|--------|------|------|
| ⏱️ **10분+ 소요** | 문제 해결에 10분 이상 걸림 | 디버깅, 설정 이슈 |
| 🔄 **패턴 반복** | 같은 패턴을 2회 이상 사용 | 에러 핸들링, API 호출 |
| 🐛 **3회+ 시도** | 해결까지 3번 이상 시도 | 버그 수정, 설정 변경 |
| 📚 **외부 참조** | 외부 문서/Stack Overflow 참조 | 라이브러리 사용법 |
| 💡 **재사용 가능** | "나중에도 쓸 것 같다" 판단 | 유틸리티 함수, 설정 |
| ⚡ **성능 개선** | 최적화로 측정 가능한 개선 | 속도, 메모리 개선 |

### Lexicon 즉시 생성 조건
| 트리거 | 설명 | 예시 |
|--------|------|------|
| 🆕 **새 용어** | 처음 등장하는 도메인 용어 | 비즈니스 용어, 기술 용어 |
| 🔤 **약어 사용** | 약어를 코드/문서에 사용 | API, JWT, SSO |
| ❓ **설명 필요** | 코드에 용어 설명 주석 작성 | 복잡한 개념 설명 |
| 🔗 **용어 혼동** | 비슷한 용어 구분 필요 | Auth vs Authorization |

### 자가 점검 (매 작업 후)
```
작업 완료 시 스스로 질문:
□ 이 작업에서 10분 이상 걸린 부분이 있었나? → DKB
□ 외부 문서를 찾아봐야 했나? → DKB
□ 새로운 용어/약어를 사용했나? → Lexicon
□ 이 해결책을 다른 곳에서도 쓸 수 있나? → DKB
```

## 🛠️ 도구 사용 가이드

### 자동화 스크립트 (`scripts/`)
효율적인 문서 관리를 위한 헬퍼 스크립트:

#### 📝 `claude-new-doc.sh`
```bash
# 새 문서 생성 (브랜치 감지 + 번호 자동 할당)
./scripts/claude-new-doc.sh [type] [name]
# 예: ./scripts/claude-new-doc.sh plan authentication
# → master_001_authentication_plan.md 생성 (현재 브랜치: master)
# → 템플릿 자동 적용
# → index.md 브랜치 섹션 자동 업데이트
```

#### 🔗 `claude-check-links.sh`
```bash
# 모든 문서의 링크 검증
./scripts/claude-check-links.sh
# → 깨진 링크 검출
# → 상호 참조 누락 확인
# → 경로 오류 감지
```

#### 🔄 `claude-sync-status.sh`
```bash
# 문서 동기화 상태 확인
./scripts/claude-sync-status.sh
# → current.md vs 실제 파일 비교
# → 누락된 문서화 확인
# → 동기화 필요 항목 리스트
```

### 문서 템플릿 (`templates/`)
일관된 문서 작성을 위한 템플릿:

| 템플릿 | 용도 | 주요 섹션 |
|--------|------|-----------|
| `plan_template.md` | 계획 문서 | 3가지 옵션, 비교 분석 |
| `todo_template.md` | 할일 문서 | 단계별 옵션, 진행 추적 |
| `review_template.md` | 검토 문서 | 메트릭, 피드백 질문 |
| `current_template.md` | 상태 추적 | 실시간 위치, 다음 단계 |
| `dkb_template.md` | 지식 문서 | 문제/해결책, 소요시간 |
| `lexicon_template.md` | 용어 정의 | 정의, 사용처, 예시 |

**템플릿 사용법**:
1. 해당 템플릿을 복사
2. Global numbering 할당
3. 섹션별로 내용 채우기
4. 관련 문서 링크 추가

### Claude 도구
- `mcp__serena__*`: 코드 탐색 및 수정
- `mcp__context7__*`: 문서 조회
- `mcp__sequential-thinking`: 복잡한 의사결정
- `mcp__time__*`: 현재 시간 조회
- `TodoWrite`: 작업 추적 관리

### 도구 사용 원칙
1. 코드 읽기 전 serena로 구조 파악
2. 2개 이상 옵션 시 sequential-thinking 사용
3. 외부 문서는 context7 사용
4. 모든 작업은 TodoWrite로 추적
5. **시간 기록 시 반드시 time MCP 사용**

## 🕐 Time MCP 필수 사용 규칙

**⚠️ 모든 timestamp 작성 시 반드시 `mcp__time__get_current_time` 도구를 호출하세요.**

### 필수 사용 상황
| 상황 | 예시 |
|------|------|
| current.md 업데이트 | `마지막 업데이트: 2025-11-28 14:35:22 KST` |
| dialog 로그 생성 | `시간: 14:35:22` |
| index.md 문서 등록 | `생성일시: 2025-11-28 14:35` |
| review 문서 작성 | `완료 시간: 2025-11-28 14:35:22` |
| 세션 시작/종료 기록 | `시작: 2025-11-28 14:00` |

### 사용 방법
```
1. mcp__time__get_current_time 도구 호출
2. 반환된 시간을 문서에 기록
3. 형식: YYYY-MM-DD HH:MM:SS (또는 필요에 따라 간략화)
```

### ❌ 절대 금지
- 시스템 시간 추측하지 않기
- 이전에 본 시간 재사용하지 않기
- Time MCP 없이 timestamp 작성하지 않기

## ✅ 체크리스트

### 세션 시작 체크리스트
- [ ] current.md 읽기/생성
- [ ] context/index.md 확인
- [ ] 관련 numbered 문서 확인
- [ ] TodoWrite 도구로 작업 목록 설정

### 작업 중 체크리스트
- [ ] 매 하위 작업마다 current.md 업데이트
- [ ] 파일 변경 즉시 문서 동기화
- [ ] 새 지식 즉시 DKB/lexicon 추가
- [ ] 차단 요소 즉시 dev_action 생성

### 세션 종료 체크리스트
- [ ] current.md 최종 상태 저장
- [ ] 모든 문서 동기화 확인
- [ ] context/index.md 업데이트
- [ ] 다음 세션 준비사항 기록

## 🚫 절대 규칙

### 절대 하지 말아야 할 것
1. ❌ 문서 동기화 없이 다음 작업 진행
2. ❌ 여러 작업 후 일괄 문서화
3. ❌ Context Compact 후 문서 미확인
4. ❌ current.md 없이 작업 진행
5. ❌ Global numbering 무시

### 항상 지켜야 할 것
1. ✅ 실시간 문서 동기화
2. ✅ current.md 항상 최신 유지
3. ✅ 모든 지식 즉시 캡처
4. ✅ Global numbering 체계 준수
5. ✅ Context Compact 시 복구 프로토콜 준수

## 📚 참고 문서

### 각 디렉토리 가이드
- **[문서 작성 가이드](docs/CLAUDE.md)** - 🔗 문서 간 링크 및 연결 규칙
- [컨텍스트 관리](context/CLAUDE.md)
- [계획 작성](docs/plan/CLAUDE.md)
- [할 일 관리](docs/todo/CLAUDE.md)
- [리뷰 작성](docs/review/CLAUDE.md)
- [구조 문서화](docs/structure/CLAUDE.md)
- [지식 베이스](docs/DKB/CLAUDE.md)
- [용어 사전](docs/lexicon/CLAUDE.md)
- [개발자 액션](docs/dev_action/CLAUDE.md)