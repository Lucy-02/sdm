# Docs 디렉토리 가이드 - 문서 작성 및 링킹

## 🔗 링크 작성 원칙

### 1. 필수 링크 규칙
- **모든 문서는 최소 3개 이상의 관련 문서와 링크**
- **양방향 링크 원칙**: A→B 링크 시 B→A 역링크 필수
- **상대 경로 사용**: 프로젝트 루트 기준 상대 경로

### 2. 링크 형식
```markdown
# 실제 코드 파일
[Component](src/components/Component.tsx)

# .claude 문서
[계획 문서](.claude/docs/plan/001_feature_plan.md)

# 특정 섹션 링크
[용어 정의](.claude/docs/lexicon/001_terms.md#authentication)
```

## 📋 문서별 필수 링크 섹션

### Plan 문서
```markdown
## 컨텍스트
- 요청: [원본 요청 또는 이슈]
- 관련 DKB: [.claude/docs/DKB/XXX_knowledge.md]
- 영향받는 구조: [.claude/docs/structure/XXX.md]
- 관련 계획: [이전/유사 계획 문서]

## 결정 후
- 할일 문서: [.claude/docs/todo/XXX_todo.md]
- 구현 시작: [첫 번째 파일 링크]
```

### Todo 문서
```markdown
## 참조
- 계획: [.claude/docs/plan/XXX_plan.md] (필수)
- 이전 작업: [관련 todo 문서]
- DKB 참고: [.claude/docs/DKB/XXX.md]
- 구조 문서: [.claude/docs/structure/XXX.md]

## 각 단계별
- 구현 파일: [실제 코드 파일 경로]
- 테스트 파일: [테스트 파일 경로]
- 문서 업데이트: [업데이트할 문서]

## 완료 후
- 검토 문서: [.claude/docs/review/XXX_review.md]
```

### Review 문서
```markdown
## 참조
- 계획: [.claude/docs/plan/XXX_plan.md] (필수)
- 할일: [.claude/docs/todo/XXX_todo.md] (필수)
- 이전 검토: [유사 작업의 검토]

## 변경 사항
### 생성된 파일
- [src/new_file.ts] → [.claude/docs/structure/src.md]

### 수정된 파일
- [src/existing.ts#L45-67] → [.claude/docs/structure/src.md]

### 캡처된 지식
- 새 DKB: [.claude/docs/DKB/XXX_new.md]
- 새 용어: [.claude/docs/lexicon/XXX_terms.md#new-term]
- Dev Action: [.claude/docs/dev_action/XXX_action.md]

## 다음 작업
- 후속 계획: [.claude/docs/plan/YYY_next.md]
- 관련 이슈: [링크]
```

### Structure 문서
```markdown
## [디렉토리/파일명] 구조

## 개요
[목적 설명]

## 의존성
- 외부: [패키지 목록]
- 내부:
  - [src/service.ts] - API 호출
  - [src/utils.ts] - 유틸리티
  - DKB: [.claude/docs/DKB/XXX_pattern.md]

## 구현한 기능
- 기능 A: [.claude/docs/plan/XXX_plan.md]에서 계획
- 기능 B: [.claude/docs/todo/YYY_todo.md]에서 구현

## 관련 문서
- 아키텍처: [.claude/docs/structure/architecture.puml]
- 테스트: [tests/XXX.test.ts]
- 설정: [config/XXX.json]
```

### DKB 문서
```markdown
## 컨텍스트
- 발견: [.claude/docs/review/XXX_review.md]에서
- 적용: [.claude/docs/todo/YYY_todo.md]에서
- 관련 DKB: [.claude/docs/DKB/similar_pattern.md]

## 문제 설명
- 파일: [src/problem_file.ts]
- 이슈: [깃헙 이슈 링크]

## 해결책
- 구현: [src/solution_file.ts]
- 테스트: [tests/solution.test.ts]

## 참조
- 외부 문서: [공식 문서 링크]
- Stack Overflow: [답변 링크]
- 사전 용어: [.claude/docs/lexicon/XXX.md#term]
```

### Lexicon 문서
```markdown
## [용어명]

- **정의**: [설명]
- **처음 사용**: [.claude/docs/plan/XXX_plan.md]
- **구현 위치**: [src/implementation.ts#L23]
- **관련 용어**:
  - [다른 용어](.claude/docs/lexicon/XXX.md#other-term)
  - [연관 용어](.claude/docs/lexicon/YYY.md#related)
- **DKB 참조**: [.claude/docs/DKB/XXX_concept.md]
- **예시 코드**: [examples/XXX.ts]
```

### Dev Action 문서
```markdown
## 컨텍스트
- 요청자: [.claude/docs/todo/XXX_todo.md#step-3]
- 차단: [.claude/docs/plan/YYY_plan.md]
- 현재 상태: [.claude/context/current.md]

## 필요한 작업
[상세 설명]

## 완료 후
- 재개할 작업: [.claude/docs/todo/XXX_todo.md#step-4]
- 업데이트할 문서:
  - [.claude/docs/structure/XXX.md]
  - [.claude/context/current.md]
```

## 🔄 링크 유지 관리

### 링크 생성 시점
1. **문서 생성 시**: 최소 3개 관련 문서 링크
2. **문서 참조 시**: 즉시 역링크 추가
3. **파일 변경 시**: structure 문서 링크 업데이트
4. **지식 발견 시**: DKB/Lexicon 상호 링크

### 링크 검증
```bash
# 정기적으로 실행
./.claude/scripts/claude-check-links.sh

# 출력 예시:
# ❌ Broken: .claude/docs/plan/001_plan.md → src/missing.ts
# ⚠️ Missing backlink: A→B exists but B→A missing
# ✅ Valid: 143 links verified
```

### 링크 템플릿 예시

#### 완벽한 Plan 문서 링크
```markdown
## 컨텍스트
- 요청: [사용자 요청](../context/dialog/20241128_001_dialog.md#request)
- 이전 시도: [실패한 접근](./002_failed_attempt_plan.md)
- 관련 DKB:
  - [인증 패턴](../DKB/001_auth_patterns.md)
  - [성능 최적화](../DKB/003_performance.md)
- 영향받는 구조:
  - [컴포넌트](../structure/src/components.md)
  - [서비스](../structure/src/services.md)
```

#### 완벽한 Review 문서 링크
```markdown
## 캡처된 지식
- 새 패턴: [싱글톤 구현](../DKB/004_singleton.md) ← 생성함
- 새 용어: [JWT](../lexicon/001_terms.md#jwt) ← 추가함
- 해결된 이슈: [#123](https://github.com/user/repo/issues/123)
- 차단 해결: [DB 설정](../dev_action/001_db_setup.md) ← 완료됨
```

## ✅ 링크 체크리스트

문서 작성 완료 전 확인:
- [ ] 최소 3개 이상 관련 문서 링크
- [ ] 모든 참조에 역링크 존재
- [ ] 실제 파일 경로 정확성
- [ ] 섹션 앵커(#) 링크 작동
- [ ] 외부 링크 접근 가능
- [ ] 링크 설명 텍스트 명확
- [ ] 상대 경로 일관성

## 🎯 좋은 링크 예시

### ❌ 나쁜 예
```markdown
- 관련 문서 참조
- 이전 작업 확인 필요
- DKB 참고
```

### ✅ 좋은 예
```markdown
- 관련 문서: [인증 시스템 계획](../plan/001_auth_plan.md#option-2)
- 이전 작업: [DB 스키마 구현](../todo/002_db_schema_todo.md) (2024-11-28 완료)
- DKB 참고: [JWT 토큰 갱신 패턴](../DKB/003_jwt_refresh.md#solution)
```

## 📊 링크 밀도 목표

| 문서 타입 | 최소 링크 | 권장 링크 | 이상적 링크 |
|----------|-----------|-----------|-------------|
| Plan | 3-5개 | 7-10개 | 12-15개 |
| Todo | 5-7개 | 10-12개 | 15-20개 |
| Review | 7-10개 | 12-15개 | 20-25개 |
| Structure | 5-8개 | 10-15개 | 20개+ |
| DKB | 3-5개 | 5-8개 | 10-12개 |
| Lexicon | 2-3개 | 4-5개 | 7-8개 |

---

> **핵심**: 문서는 고립되어서는 안 됩니다. 모든 문서는 전체 지식 그래프의 노드로서 풍부한 연결을 가져야 합니다.