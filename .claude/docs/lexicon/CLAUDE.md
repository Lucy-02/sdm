# Lexicon (용어 사전) 가이드

## 📍 디렉토리 목적

프로젝트에서 사용되는 도메인 용어, 기술 용어, 약어를 정의하고 관리합니다.

## 📝 문서 작성 규칙

### 파일명 형식 (브랜치 기반)
```
{branch}_{number}_{category}_terms.md
예: master_008_technical_terms.md
예: feature-api_001_endpoint_terms.md
```

### 📌 브랜치 기반 번호 할당
**스크립트 사용 (권장):**
```bash
./.claude/scripts/claude-new-doc.sh lexicon "category_name"
# 자동: 브랜치 감지 → 번호 할당 → index.md 업데이트
```

**수동 생성 시:**
1. `.claude/context/index.md` 열기
2. 현재 브랜치 섹션에서 "다음 번호" 확인
3. `{branch}_{number}_{name}_terms.md` 형식으로 생성
4. index.md 브랜치 섹션에 즉시 기록

### 용어 카테고리
- **Technical**: 기술 용어
- **Business**: 비즈니스 도메인
- **Abbreviation**: 약어
- **Project**: 프로젝트 고유 용어

## 📄 Lexicon 문서 템플릿

```markdown
# [번호]_[카테고리] 용어집

## 메타데이터
- 카테고리: [Technical/Business/Abbreviation/Project]
- 최종 업데이트: YYYY-MM-DD
- 용어 수: [N개]

## 용어 목록

### [용어명] {#term-id}

**한글명**: [한글 표기]
**영문명**: [English Name]
**약어**: [있다면]

**정의**:
[명확하고 간결한 정의]

**상세 설명**:
[필요시 추가 설명, 맥락, 배경]

**사용 예시**:
\`\`\`typescript
// 코드에서 사용 예
const authentication: AuthType = {...};
\`\`\`

**관련 용어**:
- [관련 용어 1]
- [관련 용어 2]

**참조**:
- 첫 사용: [문서 링크]
- 구현: [코드 파일 경로]
- DKB: [관련 지식 문서]

---

### API (Application Programming Interface) {#api}

**한글명**: 응용 프로그램 프로그래밍 인터페이스
**영문명**: Application Programming Interface
**약어**: API

**정의**:
서로 다른 소프트웨어 구성요소들이 통신할 수 있게 하는 규약과 도구의 집합

**상세 설명**:
이 프로젝트에서는 주로 RESTful API를 사용하며,
클라이언트-서버 간 데이터 교환에 활용됩니다.

**사용 예시**:
\`\`\`typescript
// API 호출 예제
const response = await api.get('/users');
\`\`\`

**관련 용어**:
- REST
- HTTP
- Endpoint

**참조**:
- 구현: src/services/api.ts
- DKB: 004_api_pattern_knowledge.md

---

## 약어 빠른 참조

| 약어 | 전체 이름 | 설명 |
|------|-----------|------|
| API | Application Programming Interface | 프로그램 간 통신 인터페이스 |
| DB | Database | 데이터베이스 |
| UI | User Interface | 사용자 인터페이스 |
| UX | User Experience | 사용자 경험 |

## 도메인 용어 맵

\`\`\`mermaid
graph LR
    A[사용자] --> B[인증]
    B --> C[세션]
    B --> D[토큰]
    C --> E[권한]
    D --> E
\`\`\`

## 용어 변경 이력

| 날짜 | 용어 | 변경 내용 | 이유 |
|------|------|-----------|------|
| 2024-11-28 | Authentication | 정의 수정 | 명확성 개선 |

## 색인 (가나다순)

- [ㄱ]
  - [권한](#authorization)
- [ㅇ]
  - [인증](#authentication)
  - [암호화](#encryption)
- [A-Z]
  - [API](#api)
  - [Database](#database)
```

## 📋 용어 추가 기준

### 추가해야 하는 경우
- 처음 접하는 도메인 용어
- 프로젝트 고유 용어
- 혼동하기 쉬운 용어
- 팀 내 합의된 용어
- 자주 사용되는 약어

### 추가하지 않는 경우
- 일반적인 프로그래밍 용어
- 널리 알려진 개념
- 일회성 사용 용어

## 🔍 용어 관리

### 명명 규칙
- 용어 ID: 소문자, 하이픈 구분
- 한글/영문 병기
- 약어는 대문자

### 상호 참조
- 관련 용어 링크
- 사용 위치 명시
- DKB 문서 연결

## ✅ 체크리스트

### 용어 추가 시
- [ ] 정의가 명확한가?
- [ ] 예시를 제공했는가?
- [ ] 관련 용어를 링크했는가?
- [ ] 첫 사용 위치를 기록했는가?

### 문서 작성 후
- [ ] Global numbering 할당
- [ ] context/index.md 업데이트
- [ ] 알파벳/가나다 순 정렬
- [ ] 색인 업데이트

## 📌 주의사항

- 정의는 한 문장으로
- 전문 용어 남용 자제
- 예시 중심 설명
- 지속적 업데이트 필요

## 🕐 Time MCP 필수 사용

**⚠️ Lexicon 문서의 모든 timestamp는 `mcp__time__get_current_time` 도구로 조회하세요.**

### 적용 위치
- 최종 업데이트 일시
- 용어 변경 이력 날짜

### ❌ 금지
- 시간 추측 금지
- 이전 시간 재사용 금지