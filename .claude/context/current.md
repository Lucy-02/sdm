# Current Work Status

## 📍 현재 위치
**파일**: apps/web/app/vendors/page.tsx
**작업**: Vendors 페이지 목업 UI 구현 완료

## 🎯 현재 작업
Vendors 페이지 목업 UI 구현 (검색, 필터링, 정렬 기능 포함)

### 완료된 작업
1. ✅ Monorepo 구조 생성 (Turborepo + pnpm workspace)
2. ✅ 공유 패키지 설정 (@sdm/types, @sdm/config)
3. ✅ Prisma 스키마 작성 (apps/api/prisma/schema.prisma)
4. ✅ Docker Compose 설정 (PostgreSQL + Redis)
5. ✅ 기본 설정 파일 (.gitignore, .prettierrc, tsconfig.base.json)
6. ✅ Next.js 15 프론트엔드 초기화 완료
7. ✅ NestJS 백엔드 초기화 완료
8. ✅ Docker Compose 실행 (PostgreSQL + Redis 시작)
9. ✅ Prisma 마이그레이션 실행 (DB 테이블 생성)
10. ✅ 백엔드 서버 실행 테스트
11. ✅ 이미지 업로드 컴포넌트 개발 완료
12. ✅ DB 더미 데이터 생성 및 삽입 (총 254개 레코드)
13. ✅ 백엔드 서버 종료
14. ✅ **Zustand 스토어에 스텝 관리 기능 추가 (currentStep, nextStep, prevStep, 이름 필드)**
15. ✅ **Step1 UI 재구성 (input 제거, 서비스 설명 추가)**
16. ✅ **Step3에 이름 입력 필드 이동 (이미지 업로더 아래)**
17. ✅ **page.tsx 스텝별 조건부 렌더링 구현**
18. ✅ **모든 스텝에 네비게이션 버튼 연결**
19. ✅ **백엔드 Vendor Service 구현 (필터링, 페이지네이션, 정렬)**
20. ✅ **백엔드 Vendor Controller 구현 (API 엔드포인트 4개)**
21. ✅ **프론트엔드 Vendor 페이지 데이터 연동 (카테고리, 목록)**
22. ✅ **Vendor 목록 카드 UI 구현 (썸네일, 태그, 평점)**
23. ✅ **Query 파라미터 타입 변환 처리 (parseInt)**
24. ✅ **통합 테스트 완료 (백엔드/프론트엔드 서버 실행)**
25. ✅ **메인 페이지 Carousel에 Vendor 데이터 연결 (스튜디오, 드레스)**
26. ✅ **MongoDB 마이그레이션 계획 문서 작성 (007_mongodb_migration_plan.md)**
27. ✅ **PostgreSQL vs MongoDB 비교 DKB 문서 작성 (008_postgresql_vs_mongodb.md)**
28. ✅ **docker-compose.yml에 MongoDB 추가 (Replica Set 모드)**
29. ✅ **Prisma schema MongoDB로 완전 전환**
30. ✅ **Many-to-Many 관계 재설계 (VendorTag→tags JSON, Favorite→favoriteVendorIds)**
31. ✅ **Enum을 String으로 변경**
32. ✅ **MongoDB Replica Set 초기화**
33. ✅ **MongoDB seed 스크립트 작성 및 데이터 삽입 (20 vendors, 5 categories, 15 tags)**
34. ✅ **백엔드 Vendor 서비스 JSON 필드 처리 로직 수정**
35. ✅ **Vendors 페이지 목업 UI 구현 및 개선** ⭐ NEW
    - 검색 input (업체 이름 검색, 향상된 디자인)
    - 카테고리 선택 (전체/스튜디오/드레스/메이크업/예식장/한복) + 이모지 아이콘
    - 정렬 옵션 (인기순/가격순/별점순) + 아이콘
    - 업체 카드 그리드 (3열 레이아웃, 반응형)
    - 좋아요 기능, 인기 뱃지, 평점/리뷰 표시
    - 추가 기능: 추천 뱃지, 할인 뱃지, 통계 정보
    - 12개 목업 데이터 (다양한 카테고리)
    - Next.js Image 컴포넌트 사용
    - 향상된 애니메이션 및 호버 효과
    - 검색 결과 없을 시 리셋 버튼
    - 상세보기 버튼 추가

### 🔄 MongoDB 마이그레이션 상세
- ✅ Prisma provider: `postgresql` → `mongodb`
- ✅ ID 필드: `@default(cuid())` → `@default(auto()) @map("_id") @db.ObjectId`
- ✅ VendorImage 모델 제거 → `Vendor.images: Json` (임베디드)
- ✅ VendorTag 모델 제거 → `Vendor.tags: Json` (임베디드)
- ✅ Favorite 모델 제거 → `User.favoriteVendorIds: String[]` (배열)
- ✅ Enum 제거 → String 타입으로 변경
- ✅ MongoDB Replica Set 설정 (트랜잭션 지원)
- ✅ Seed 데이터: 20 users, 5 categories, 15 tags, 20 vendors, 15 simulations, 20 bookings, 8 reviews

### Next.js 초기화 상세
- ✅ Next.js 15 + App Router
- ✅ TypeScript + Tailwind CSS 설정
- ✅ shadcn/ui 기본 설정 (Button, Card 컴포넌트)
- ✅ 기본 페이지 구조 (/, /vendors, /my-results)
- ✅ Zustand 스토어 설정 (useSimulatorStore)
- ✅ API 클라이언트 (axios)
- ✅ 환경변수 설정 (.env.local)

### NestJS 백엔드 초기화 상세
- ✅ NestJS 프로젝트 구조 생성
- ✅ 의존성 설치 (package.json)
- ✅ 기본 모듈 구조 (Upload, Processing, Vendor, Result, Storage)
- ✅ Prisma 모듈 및 서비스 생성
- ✅ Global Config 모듈
- ✅ main.ts (서버 진입점, CORS, Validation Pipe)
- ✅ Prisma Client 생성

### Vendor API 구현 상세
- ✅ GET /api/vendors - 전체 업체 목록 (필터링, 페이지네이션, 정렬)
- ✅ GET /api/vendors/categories - 카테고리 목록
- ✅ GET /api/vendors/category/:slug - 카테고리별 업체 목록
- ✅ GET /api/vendors/:id - 특정 업체 상세 정보
- ✅ Query 파라미터 타입 변환 (page, limit, priceMin, priceMax)

### 다음 단계
1. ✅ MongoDB 마이그레이션 완료
2. 백엔드/프론트엔드 통합 테스트
3. S3/R2 스토리지 연동 (실제 이미지 저장)
4. AI 처리 큐 시스템 구현 (BullMQ)
5. WebSocket으로 실시간 진행 상태 전달
6. 결과 페이지 구현 및 업체 매칭 기능

## 📊 진행 상황
- [x] 기술 스택 추천 완료
- [x] 초기 계획 문서 작성 (001_initial_plan.md)
- [x] 설정 Todo 문서 작성 (002_setup_todo.md)
- [x] DB 스키마 설계 완료 (003_database_schema.md)
- [x] Monorepo 구조 생성
- [x] Prisma 스키마 작성
- [x] Docker Compose 설정
- [x] Next.js 프론트엔드 초기화
- [x] NestJS 백엔드 초기화
- [x] Prisma Client 생성
- [x] Docker Compose 실행 (PostgreSQL + Redis healthy)
- [x] Prisma 마이그레이션 실행 (20251205015830_init)
- [x] 백엔드 서버 실행 (http://localhost:3001)
- [x] 이미지 업로드 컴포넌트 개발
- [x] 프론트엔드 서버 실행 (http://localhost:3002)
- [x] Vendor API 구현 및 데이터 연동 ⭐ NEW

## 🔗 관련 문서
- [001_initial_plan.md](../docs/plan/001_initial_plan.md)
- [002_setup_todo.md](../docs/todo/002_setup_todo.md)
- [003_database_schema.md](../docs/structure/003_database_schema.md)
- [004_initial_setup_review.md](../docs/review/004_initial_setup_review.md)
- [005_nestjs_basics.md](../docs/DKB/005_nestjs_basics.md)
- [006_prisma_basics.md](../docs/DKB/006_prisma_basics.md)
- [007_mongodb_migration_plan.md](../docs/plan/007_mongodb_migration_plan.md) ⭐ NEW
- [008_postgresql_vs_mongodb.md](../docs/DKB/008_postgresql_vs_mongodb.md) ⭐ NEW

## 📝 메모
- Frontend: Next.js 15 + TypeScript + Tailwind
- Backend: NestJS + **MongoDB** + Redis ⭐ CHANGED
- Database: PostgreSQL → **MongoDB** (Replica Set 모드) ⭐ MIGRATED
- 메인 기능: 결혼 사진 시뮬레이터 (신랑/신부 이미지 입력 → AI 처리 → 결과 출력)
- 부가 기능: 스튜디오/메이크업/예복 업체 매칭 플랫폼

## 📁 생성된 파일
```
sdm/
├── package.json                    ✅
├── pnpm-workspace.yaml            ✅
├── turbo.json                     ✅
├── tsconfig.base.json             ✅
├── .gitignore                     ✅
├── .prettierrc                    ✅
├── .npmrc                         ✅
├── docker-compose.yml             ✅
├── apps/
│   ├── api/                       ✅ NEW
│   │   ├── src/
│   │   │   ├── main.ts            ✅
│   │   │   ├── app.module.ts      ✅
│   │   │   ├── config/            ✅
│   │   │   ├── prisma/            ✅
│   │   │   ├── upload/            ✅
│   │   │   ├── processing/        ✅
│   │   │   ├── vendor/            ✅
│   │   │   ├── result/            ✅
│   │   │   └── storage/           ✅
│   │   ├── prisma/
│   │   │   └── schema.prisma      ✅
│   │   ├── package.json           ✅
│   │   ├── tsconfig.json          ✅
│   │   ├── nest-cli.json          ✅
│   │   └── .env.example           ✅
│   └── web/                       ✅ NEW
│       ├── app/
│       │   ├── layout.tsx         ✅
│       │   ├── page.tsx           ✅
│       │   ├── globals.css        ✅
│       │   ├── vendors/page.tsx   ✅
│       │   └── my-results/page.tsx ✅
│       ├── components/
│       │   ├── ui/
│       │   │   ├── button.tsx     ✅
│       │   │   └── card.tsx       ✅
│       │   ├── simulator/         (디렉토리 생성)
│       │   └── vendor/            (디렉토리 생성)
│       ├── lib/
│       │   ├── utils.ts           ✅
│       │   └── api-client.ts      ✅
│       ├── store/
│       │   └── useSimulatorStore.ts ✅
│       ├── package.json           ✅
│       ├── tsconfig.json          ✅
│       ├── next.config.js         ✅
│       ├── tailwind.config.ts     ✅
│       ├── postcss.config.js      ✅
│       ├── components.json        ✅
│       └── .env.local             ✅
├── packages/
│   ├── types/                     ✅
│   └── config/                    ✅
└── .claude/                       (문서 디렉토리)
```

## 📁 새로 생성된 파일
```
apps/web/app/simulator/steps/step3.tsx    ✅ NEW (이미지 업로드 컴포넌트)
apps/api/src/upload/upload.controller.ts   ✅ UPDATED (multer 파일 업로드)
apps/api/src/upload/upload.service.ts      ✅ UPDATED (handleImageUpload)
apps/api/prisma/migrations/20251205015830_init/  ✅ NEW (DB 마이그레이션)
```

## ⏰ 마지막 업데이트
2025-12-05 (PostgreSQL → MongoDB 완전 마이그레이션 완료)

## 📝 최근 변경 사항
### 새로 생성된 파일
- (없음 - 기존 파일 수정만 진행)

### 수정된 파일
- `apps/web/app/page.tsx` - 스튜디오/드레스 Carousel에 실제 업체 데이터 연동
  - useEffect로 스튜디오(studio), 드레스(dress) 카테고리 업체 10개씩 로드
  - ImageCarousel children에 업체 카드 컴포넌트 전달
  - 업체 이미지, 이름, 위치, 평점 표시
  - 호버 시 정보 표시 (gradient overlay)
  - 클릭 시 해당 카테고리 필터된 /vendors 페이지로 이동

## 🖥️ 서버 상태
- ⏸️ 백엔드: http://localhost:3001 (중지됨)
- ⏸️ 프론트엔드: http://localhost:3002 (중지됨)
- ✅ MongoDB: localhost:27017 (실행 중 - Replica Set: rs0) ⭐ NEW
- ✅ Redis: localhost:6379 (실행 중)
- ⏸️ PostgreSQL: localhost:5432 (더 이상 사용 안 함)
