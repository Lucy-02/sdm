# Global Numbering Index (브랜치 기반)

## 번호 체계 설명

### 파일명 형식
```
{branch}_{number}_{name}_{type}.md
예: develop_001_initial_plan.md
예: feature-auth_001_jwt_implementation_todo.md
```

### 브랜치 이름 정규화
- 슬래시(/) -> 하이픈(-) 변환
- 소문자 변환
- 예: `feature/auth-system` -> `feature-auth-system`

---

## 브랜치별 번호 현황

### [develop]
**다음 번호: 019**

| 번호 | 파일명 | 위치 | 생성일시 | 설명 |
|------|--------|------|----------|------|
| 001 | develop_001_initial_plan.md | docs/plan/ | 2025-12-04 13:25 | 프로젝트 초기 계획 및 기술 스택 선정 |
| 002 | develop_002_setup_todo.md | docs/todo/ | 2025-12-04 13:27 | 프로젝트 초기 설정 단계별 할일 |
| 003 | develop_003_database_schema.md | docs/structure/ | 2025-12-04 13:32 | 확장 가능한 데이터베이스 스키마 설계 |
| 004 | develop_004_initial_setup_review.md | docs/review/ | 2025-12-04 13:47 | 초기 설정 완료 리뷰 및 검증 |
| 005 | develop_005_nestjs_basics.md | docs/DKB/ | 2025-12-05 14:10 | NestJS 프레임워크 기본 개념 및 사용법 |
| 006 | develop_006_prisma_basics.md | docs/DKB/ | 2025-12-05 14:12 | Prisma ORM 기본 개념 및 쿼리 사용법 |
| 007 | develop_007_mongodb_migration_plan.md | docs/plan/ | 2025-12-05 | PostgreSQL -> MongoDB 마이그레이션 계획 |
| 008 | develop_008_postgresql_vs_mongodb.md | docs/DKB/ | 2025-12-05 | PostgreSQL vs MongoDB 차이점 및 Many-to-Many 관계 설명 |
| 009 | develop_009_auth_library_research.md | docs/DKB/ | 2025-12-09 | Auth 라이브러리 비교 조사 |
| 010 | develop_010_auth_system_plan.md | docs/plan/ | 2025-12-09 | Auth 시스템 구현 계획 (3가지 옵션 비교) |
| 011 | develop_011_better_auth_guide.md | docs/DKB/ | 2025-12-09 | Better Auth 상세 가이드 (흐름, 원리, 설정) |
| 012 | develop_012_phase3_implementation_plan.md | docs/plan/ | 2025-12-09 | Phase 3 Better Auth 구현 계획 |
| 013 | develop_013_phase4_auth_integration_plan.md | docs/plan/ | 2025-12-09 | Phase 4 로그인/회원가입 연동 계획 |
| 014 | develop_014_vendor_register_plan.md | docs/plan/ | 2025-12-09 | Vendor 회원가입 페이지 구현 계획 |
| 015 | develop_015_vendors_api_fix_plan.md | docs/plan/ | 2025-12-09 | Vendors API 수정 계획 (DATABASE_URL 오류) |
| 016 | develop_016_project_structure.md | docs/structure/ | 2025-12-12 | SDM 프로젝트 전체 구조 문서화 |
| 017 | develop_017_infinite_scroll_plan.md | docs/plan/ | 2025-12-12 | Vendors 페이지 무한 스크롤 구현 계획 |
| 018 | develop_018_vendors_api_category_fix_plan.md | docs/plan/ | 2025-12-12 | Vendors API categoryId/slug 문제 해결 계획 |

### [master]
**다음 번호: 001**

| 번호 | 파일명 | 위치 | 생성일시 | 설명 |
|------|--------|------|----------|------|
| (없음) | | | | |

---

## 번호 할당 규칙
- 각 브랜치는 독립적인 번호 체계 (001부터 시작)
- 브랜치 내에서만 순차 번호 사용
- Merge 시 파일명으로 충돌 방지 (브랜치 prefix 덕분)
- 한 번 할당된 번호는 해당 브랜치 내에서 재사용 금지

## Merge 가이드
1. 각 브랜치 섹션은 독립적으로 유지
2. 충돌 시 양쪽 섹션 모두 보존
3. Merge 후 필요시 브랜치 섹션 정리

## 삭제된 파일
| 브랜치 | 번호 | 파일명 | 삭제일시 | 사유 |
|--------|------|--------|----------|------|
| (없음) | | | | |

## 제외 파일 (번호 미할당)
- CLAUDE.md (모든 가이드 문서)
- current.md (실시간 상태)
- dialog/*.md (대화 로그)
- index.md (이 파일)

## 통계
- 총 생성 문서: 19
- 활성 문서: 19
- 삭제 문서: 0
- 최근 생성: develop_018_vendors_api_category_fix_plan.md (2025-12-12)
