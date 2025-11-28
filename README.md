# Claude Code Template - Quick Start Guide

## 🚀 빠른 시작

이 저장소는 Claude Code와 함께 사용하기 위한 체계적인 문서화 기반 개발 템플릿입니다.

### 첫 작업 시작하기

1. **Claude Code 열기**: [claude.ai/code](https://claude.ai/code)
2. **이 저장소 열기**
3. **CLAUDE.md 확인**: 전체 시스템 이해
4. **작업 시작**: 아래 프로세스 따르기

### 📋 표준 작업 프로세스

```
계획(Plan) → 할일(Todo) → 구현(Implementation) → 검토(Review)
```

#### 1️⃣ 새 작업 시작
```bash
# 1. current.md 확인 (진행 중인 작업 파악)
cat .claude/context/current.md

# 2. 번호 확인 (새 문서용)
cat .claude/context/index.md

# 3. 작업 시작
# Claude가 자동으로 계획 문서 생성
```

#### 2️⃣ Context Compact 후 복구
```bash
# 필수 읽기 순서
1. .claude/context/current.md
2. 진행 중인 plan 문서
3. 진행 중인 todo 문서
4. 관련 DKB 문서들
```

#### 3️⃣ 실시간 문서 동기화
```
⚠️ 매 작업 직후 즉시 업데이트:
- current.md: 작업 상태
- structure/: 파일 변경
- DKB/: 새 지식
- lexicon/: 새 용어
```

## 📁 디렉토리 구조

```
.claude/
├── context/          # 작업 컨텍스트 관리
│   ├── current.md   # 🔴 현재 작업 상태 (항상 최신)
│   ├── index.md     # 🔢 Global numbering 인덱스
│   └── dialog/      # 대화 로그
├── docs/            # 모든 문서 디렉토리
│   ├── plan/        # 계획 문서 (3가지 옵션)
│   ├── todo/        # 할일 문서 (단계별 작업)
│   ├── review/      # 검토 문서 (완료 후)
│   ├── structure/   # 코드 구조 문서화
│   ├── DKB/         # Domain Knowledge Base
│   ├── lexicon/     # 용어 사전
│   └── dev_action/  # 개발자 액션 요청
├── scripts/         # 자동화 스크립트
└── templates/       # 문서 템플릿
```

## 🔢 Global Numbering 체계

- **순차 번호**: 001, 002, 003... (디렉토리 무관)
- **중앙 관리**: `.claude/context/index.md`
- **제외 대상**: CLAUDE.md, current.md, dialog/*.md

### 새 문서 생성 프로세스
```
1. index.md에서 "다음 번호" 확인
2. 해당 번호로 문서 생성
3. index.md에 즉시 등록
```

## ⚡ 핵심 규칙

### ✅ 반드시 해야 할 것
- 매 작업 직후 current.md 업데이트
- 파일 변경 즉시 structure 문서 동기화
- 새 지식/용어 발견 즉시 문서화
- Context Compact 후 문서 먼저 읽기

### ❌ 절대 하지 말아야 할 것
- 문서 동기화 없이 다음 작업 진행
- 여러 작업 후 일괄 문서화
- "나중에 한번에" 문서화
- current.md 없이 작업 진행

## 🆘 긴급 복구 절차

### Context Compact 발생 시
1. **즉시 중단**: 추가 작업 금지
2. **current.md 읽기**: 현재 상태 파악
3. **관련 문서 확인**: 활성 문서들 열람
4. **정확한 지점에서 재개**: 문서화된 위치부터

### 작업 상태 불명확 시
1. **current.md 확인**: 마지막 업데이트 상태
2. **dialog 로그 확인**: 최근 대화 내용
3. **git status**: 실제 변경 사항 확인

## 💡 자주 하는 실수와 해결법

### 1. 번호 중복 할당
- **문제**: 같은 번호로 여러 문서 생성
- **해결**: 항상 index.md 먼저 확인
- **예방**: 번호 할당 즉시 index.md 업데이트

### 2. current.md 미업데이트
- **문제**: Context Compact 후 상태 손실
- **해결**: 매 작업 직후 즉시 업데이트
- **예방**: 작업 완료 = current.md 업데이트

### 3. 링크 깨짐
- **문제**: 잘못된 경로로 링크 생성
- **해결**: 상대 경로 규칙 준수
- **예방**:
  - 실제 파일: `src/components/Auth.tsx`
  - .claude 문서: `.claude/docs/plan/001_plan.md`

### 4. 문서 동기화 누락
- **문제**: 구조 문서와 실제 코드 불일치
- **해결**: 파일 변경 즉시 structure/ 업데이트
- **예방**: 변경→동기화→다음 작업 순서 준수

## 🔧 유용한 도구들

### 자동화 스크립트
```bash
# 🆕 새 문서 생성 (번호 자동 할당!)
./.claude/scripts/claude-new-doc.sh plan "authentication_system"
# → 자동으로 다음 번호 할당 (예: 004_authentication_system_plan.md)
# → 템플릿 자동 적용
# → index.md 자동 업데이트

# 🔗 링크 검증
./.claude/scripts/claude-check-links.sh
# → 깨진 링크 검출
# → 양방향 링크 확인

# 🔄 동기화 상태 확인
./.claude/scripts/claude-sync-status.sh
# → current.md vs 실제 파일 상태 비교
```

### 빠른 명령어
```bash
# 현재 작업 상태 확인
cat .claude/context/current.md

# 다음 번호 확인
grep "다음 번호" .claude/context/index.md

# 최근 dialog 확인
ls -lt .claude/context/dialog/ | head -5

# 모든 numbered 문서 찾기
find .claude -name "[0-9][0-9][0-9]_*.md" | sort

# 링크 검증 (broken links 찾기)
grep -r "\[.*\](" .claude --include="*.md" | grep -v "http"
```

### 템플릿 활용
```bash
# 템플릿 목록 확인
ls .claude/templates/

# 새 계획 문서 생성 (템플릿 복사)
cp .claude/templates/plan_template.md .claude/docs/plan/004_new_feature_plan.md
# → index.md에 등록 잊지 말기!

# 주요 템플릿:
# - plan_template.md     (3가지 옵션 계획)
# - todo_template.md     (단계별 작업)
# - review_template.md   (완료 검토)
# - current_template.md  (작업 상태)
```

## 📚 추가 문서

- **전체 가이드**: [CLAUDE.md](CLAUDE.md)
- **메인 가이드**: [.claude/CLAUDE.md](.claude/CLAUDE.md)
- **컨텍스트 관리**: [.claude/context/CLAUDE.md](.claude/context/CLAUDE.md)

## 🤝 기여 방법

1. 이 템플릿 사용 중 개선점 발견 시
2. `.claude/docs/DKB/`에 지식 문서화
3. `.claude/docs/dev_action/`에 개선 제안 작성

## 📝 라이선스

이 템플릿은 자유롭게 사용 및 수정 가능합니다.

---

**시작하기**: Claude Code에서 이 저장소를 열고 작업을 시작하세요!