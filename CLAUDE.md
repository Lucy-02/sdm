# CLAUDE.md

이 파일은 이 저장소의 코드로 작업할 때 Claude Code(claude.ai/code)에 대한 지침을 제공합니다.

## ⚠️ 중요: 새로운 문서 체계

**모든 상세 가이드와 워크플로우는 `.claude/` 디렉토리로 체계화되었습니다.**

## 📍 필수 확인 문서

### 즉시 확인해야 할 파일
1. **[.claude/CLAUDE.md](.claude/CLAUDE.md)** - 메인 가이드 및 Context Compact 복구 프로토콜
2. **[.claude/context/current.md](.claude/context/current.md)** - 현재 작업 상태 (실시간 동기화)

## 🚨 Context Compact 발생 시

Context Compact(토큰 한계로 인한 컨텍스트 재설정)가 발생하면:

1. **반드시 [.claude/CLAUDE.md](.claude/CLAUDE.md) 먼저 읽기**
2. 복구 프로토콜 따라 작업 재개
3. 절대 "어디까지 했나요?" 묻지 않기 (문서에 모든 정보 있음)

## 📁 새로운 구조 개요

```
.claude/
├── CLAUDE.md                    # 🔴 메인 가이드 (최우선 확인)
├── context/
│   ├── current.md              # 🔴 실시간 작업 상태
│   └── history/
│       ├── dialog/             # 대화 로그
│       └── index.md            # Global numbering 인덱스
├── plan/                        # 계획 문서
├── todo/                        # 할일 문서
├── review/                      # 리뷰 문서
├── structure/                   # 코드 구조 문서화
├── DKB/                         # 도메인 지식
├── lexicon/                     # 용어 사전
└── dev_action/                  # 개발자 액션
```

## 🔢 Global Numbering 체계

- **생성 순서 기반**: 001, 002, 003... (디렉토리 무관)
- **중앙 관리**: `.claude/context/history/index.md`
- **제외 파일**: CLAUDE.md, current.md, dialog/*.md

### 📌 문서 생성 시 필수 확인
**새 numbered 문서 생성 전 반드시:**
1. `.claude/context/history/index.md` 열기
2. "다음 번호" 확인
3. 해당 번호로 문서 생성
4. index.md에 즉시 기록

## ⚡ 핵심 원칙

### 🔴 최소 작업단위 실시간 동기화 (필수!)

**매 원자적 작업(파일 1개 수정, 함수 1개 작성, 버그 1개 수정) 완료 즉시:**

1. **`.claude/context/current.md`** - 즉시 업데이트
   - 작업 위치 (파일명, 줄번호)
   - 다음 작업
   - 파일 변경 내역

2. **구조 문서** - 파일 변경 시 즉시
   - `.claude/structure/` 내 관련 문서
   - 파일 생성/수정/삭제 반영

3. **지식 문서** - 발견 즉시
   - `.claude/DKB/` - 새 패턴이나 해결책
   - `.claude/lexicon/` - 새 용어

4. **차단 문서** - 발견 즉시
   - `.claude/dev_action/` - 외부 도움 필요 시

### ⏰ 동기화 타이밍 = "즉시"

```
작업 완료 → 문서 업데이트 → 다음 작업
    ↑                           ↓
    └───── 절대 건너뛰기 금지 ←─┘
```

### 절대 규칙
- ❌ 문서 동기화 없이 다음 작업 진행 금지
- ❌ "나중에 한번에" 문서화 금지
- ❌ 여러 작업 후 일괄 문서화 금지
- ❌ Context Compact 후 문서 미확인 금지

## 📚 디렉토리별 가이드

각 디렉토리의 상세 가이드는 해당 CLAUDE.md 참조:
- [컨텍스트 관리](.claude/context/CLAUDE.md)
- [계획 작성](.claude/plan/CLAUDE.md)
- [할일 관리](.claude/todo/CLAUDE.md)
- [리뷰 작성](.claude/review/CLAUDE.md)
- [구조 문서화](.claude/structure/CLAUDE.md)
- [지식 베이스](.claude/DKB/CLAUDE.md)
- [용어 사전](.claude/lexicon/CLAUDE.md)
- [개발자 액션](.claude/dev_action/CLAUDE.md)

## 🛠️ 필수 도구

- `mcp__serena__*`: 코드 탐색 및 수정
- `mcp__context7__*`: 문서 조회
- `mcp__sequential-thinking`: 복잡한 의사결정
- `TodoWrite`: 작업 추적

---

> **중요**: 이 문서는 간략한 안내입니다. 실제 작업 시에는 반드시 [.claude/CLAUDE.md](.claude/CLAUDE.md)의 전체 가이드를 따르세요.