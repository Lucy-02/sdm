# 001_initial_plan.md - 결혼식 준비 플랫폼 초기 계획

**생성일**: 2025-12-04
**상태**: 진행중
**관련 문서**:
- [Current Status](../../context/current.md)

---

## 📋 프로젝트 개요

### 프로젝트명
**SDM** (Studio-Dress-Makeup) Platform - 결혼식 준비 통합 플랫폼

### 핵심 가치
결혼 준비 커플들이 AI 시뮬레이션으로 결혼 사진을 미리 확인하고, 최적의 업체(스튜디오/메이크업/예복)를 매칭받는 원스톱 서비스

### 메인 기능
1. **결혼 사진 AI 시뮬레이터** (핵심)
   - 신랑/신부 얼굴 사진 업로드
   - AI 처리를 통한 결혼 사진 시뮬레이션

2. **업체 매칭 플랫폼**
   - 스튜디오 검색 및 예약
   - 메이크업 디자이너 매칭
   - 예복/드레스 대여 업체 연결

---

## 🎯 기술 스택 선정

### Option 1: Monorepo 풀스택 (추천)
**장점**: TypeScript 풀스택, 타입 공유, 통합 관리
**단점**: 초기 설정 복잡도

#### 구성
```yaml
Frontend:
  Framework: Next.js 15 (App Router) + TypeScript
  Styling: Tailwind CSS + shadcn/ui
  State: Zustand
  Forms: React Hook Form + Zod
  Image: react-dropzone + sharp

Backend:
  Framework: NestJS + TypeScript
  API: REST + WebSocket (Socket.io)
  Queue: BullMQ + Redis
  Upload: Multer
  Validation: class-validator

Database:
  Main: PostgreSQL (RDS)
  ORM: Prisma
  Cache: Redis
  Storage: AWS S3 / Cloudflare R2

Infra:
  Frontend: Vercel
  Backend: Railway / Render
  CI/CD: GitHub Actions
  Monitoring: Sentry
```

**선택 이유**:
- ✅ 프론트-백 타입 안전성 (공유 types 패키지)
- ✅ NestJS 구조화로 확장성 우수
- ✅ BullMQ로 이미지 처리 큐 관리 용이
- ✅ Prisma로 DB 마이그레이션 간편

---

### Option 2: Serverless 아키텍처
**장점**: 비용 효율, 자동 스케일링
**단점**: Cold start, WebSocket 제약

#### 구성
```yaml
Frontend:
  Framework: Next.js 15 (Vercel)

Backend:
  Functions: Vercel Serverless Functions
  OR: AWS Lambda + API Gateway

Database:
  Main: Supabase (PostgreSQL + Auth)
  Storage: Cloudflare R2

Queue:
  Vercel Cron + Upstash Redis
```

**제약사항**:
- ❌ WebSocket 실시간 업데이트 제한적
- ❌ 대용량 이미지 처리 시 타임아웃 위험
- ⚠️ AI 처리 시간이 15초 이상이면 부적합

---

### Option 3: 하이브리드 (Next.js + Supabase)
**장점**: 빠른 개발, Auth 기본 제공
**단점**: Supabase 종속성

#### 구성
```yaml
Frontend + Backend:
  Framework: Next.js 15
  Auth: Supabase Auth
  Database: Supabase PostgreSQL
  Storage: Supabase Storage
  Realtime: Supabase Realtime

Image Processing:
  별도 Worker: Cloudflare Workers
  OR: 외부 마이크로서비스
```

**적합성**:
- ✅ MVP 빠른 출시 가능
- ⚠️ 복잡한 이미지 처리 로직은 별도 서비스 필요

---

## ✅ 최종 선택: Option 1 (Monorepo 풀스택)

### 선택 근거
1. **이미지 처리 파이프라인**:
   - 복잡한 AI 처리 워크플로우 필요
   - BullMQ로 안정적인 큐 관리
   - WebSocket으로 실시간 진행률 표시

2. **확장성**:
   - 향후 B2B (업체용 대시보드) 추가 용이
   - NestJS 모듈 시스템으로 기능 분리

3. **개발 경험**:
   - Prisma로 타입 안전한 DB 쿼리
   - 공유 타입으로 프론트-백 일관성

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                  Vercel (Frontend)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │          Next.js 15 App Router               │  │
│  │                                              │  │
│  │  /              → 메인 시뮬레이터 페이지     │  │
│  │  /vendors       → 업체 검색/목록             │  │
│  │  /vendors/[id]  → 업체 상세                  │  │
│  │  /my-results    → 내 시뮬레이션 결과         │  │
│  │                                              │  │
│  │  Components:                                 │  │
│  │  - ImageUploadForm (드래그앤드롭)           │  │
│  │  - ProcessingStatus (WebSocket 실시간)      │  │
│  │  - ResultGallery (결과 갤러리)              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        │ HTTPS / WSS
                        ▼
┌─────────────────────────────────────────────────────┐
│              Railway/Render (Backend)               │
│  ┌──────────────────────────────────────────────┐  │
│  │              NestJS Application              │  │
│  │                                              │  │
│  │  Modules:                                    │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ UploadModule                           │ │  │
│  │  │ - POST /upload (Multer)                │ │  │
│  │  │ - 이미지 검증 (크기/형식)              │ │  │
│  │  │ - S3 업로드                            │ │  │
│  │  │ - Queue에 작업 추가                    │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ ProcessingModule                       │ │  │
│  │  │ - BullMQ Processor                     │ │  │
│  │  │ - 외부 AI API 호출 (사용자 구현)       │ │  │
│  │  │ - WebSocket Gateway (진행률 푸시)      │ │  │
│  │  │ - 결과 DB 저장                         │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ VendorModule                           │ │  │
│  │  │ - GET /vendors (목록/검색)             │ │  │
│  │  │ - GET /vendors/:id (상세)              │ │  │
│  │  │ - POST /vendors (등록 - 관리자용)      │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ ResultModule                           │ │  │
│  │  │ - GET /results (사용자 결과 목록)       │ │  │
│  │  │ - GET /results/:id (결과 상세)         │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                │            │
        ┌───────┴────┐  ┌────┴──────┐
        ▼            ▼  ▼           ▼
┌─────────────┐  ┌──────────┐  ┌─────────┐
│ PostgreSQL  │  │  Redis   │  │ S3/R2   │
│   (RDS)     │  │ (Upstash)│  │(Images) │
│             │  │          │  │         │
│ - users     │  │ - Queue  │  │ - input/│
│ - results   │  │ - Cache  │  │ - output│
│ - vendors   │  │ - Session│  │         │
└─────────────┘  └──────────┘  └─────────┘
```

---

## 📊 데이터베이스 스키마 (초안)

### Prisma Schema
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  results       Result[]
}

model Result {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])

  groomImageUrl String    // S3 원본 URL
  brideImageUrl String    // S3 원본 URL
  outputImageUrl String?  // 처리 결과 URL

  status        ProcessingStatus @default(PENDING)
  concept       String?   // 컨셉 (클래식, 모던 등)

  createdAt     DateTime  @default(now())
  completedAt   DateTime?

  @@index([userId])
}

enum ProcessingStatus {
  PENDING      // 대기
  UPLOADING    // 업로드 중
  PROCESSING   // AI 처리 중
  COMPLETED    // 완료
  FAILED       // 실패
}

model Vendor {
  id            String    @id @default(cuid())
  type          VendorType
  name          String
  description   String?
  location      String
  priceRange    String?   // "100만원~200만원"
  images        String[]  // 포트폴리오 이미지 URLs
  rating        Float?

  createdAt     DateTime  @default(now())

  @@index([type])
}

enum VendorType {
  STUDIO       // 스튜디오
  MAKEUP       // 메이크업
  DRESS        // 예복
}
```

---

## 🔄 이미지 처리 워크플로우

### 1단계: 업로드 (Frontend)
```typescript
사용자 → ImageUploadForm
         ↓
    [신랑 이미지 선택]
    [신부 이미지 선택]
    [컨셉 선택 (옵션)]
         ↓
    클라이언트 검증:
    - 파일 형식 (jpg, png)
    - 파일 크기 (< 10MB)
    - 이미지 비율
         ↓
    POST /api/upload (multipart/form-data)
```

### 2단계: 서버 처리 (Backend)
```typescript
NestJS UploadController
         ↓
    Multer 파일 수신
         ↓
    서버 검증:
    - 파일 형식 재확인
    - 이미지 EXIF 체크
    - 얼굴 감지 (선택적)
         ↓
    S3에 원본 업로드:
    - s3://bucket/input/{userId}/{resultId}/groom.jpg
    - s3://bucket/input/{userId}/{resultId}/bride.jpg
         ↓
    DB에 Result 레코드 생성 (status: UPLOADING)
         ↓
    BullMQ에 작업 추가:
    - Job ID: resultId
    - Payload: { groomUrl, brideUrl, concept }
         ↓
    클라이언트에 응답:
    - resultId
    - WebSocket 연결 정보
```

### 3단계: AI 처리 (Queue Worker)
```typescript
BullMQ Processor
         ↓
    작업 수신
         ↓
    WebSocket 알림: "처리 시작"
    DB 상태 업데이트: PROCESSING
         ↓
    외부 AI API 호출:
    - 사용자가 구현한 처리 로직
    - 예상 시간: 30초~2분
         ↓
    진행률 업데이트 (WebSocket):
    - 10% → 50% → 90%
         ↓
    결과 이미지 수신
         ↓
    S3에 결과 업로드:
    - s3://bucket/output/{userId}/{resultId}/result.jpg
         ↓
    DB 업데이트:
    - outputImageUrl 저장
    - status: COMPLETED
    - completedAt: now()
         ↓
    WebSocket 알림: "처리 완료" + 결과 URL
```

### 4단계: 결과 표시 (Frontend)
```typescript
WebSocket 이벤트 수신
         ↓
    ProcessingStatus 컴포넌트 업데이트
         ↓
    결과 페이지로 자동 이동
         ↓
    ResultGallery 표시:
    - 원본 (신랑/신부) vs 결과 비교
    - 다운로드 버튼
    - 공유 기능
    - "다른 컨셉으로 재시도" 버튼
```

---

## 📁 프로젝트 구조

```
sdm/
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # 메인 시뮬레이터
│   │   │   ├── vendors/
│   │   │   │   ├── page.tsx          # 업체 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # 업체 상세
│   │   │   ├── my-results/
│   │   │   │   └── page.tsx          # 내 결과 목록
│   │   │   └── api/                  # API Routes (프록시용)
│   │   ├── components/
│   │   │   ├── simulator/
│   │   │   │   ├── ImageUploadForm.tsx
│   │   │   │   ├── ImageDropzone.tsx
│   │   │   │   ├── ProcessingStatus.tsx
│   │   │   │   ├── ResultGallery.tsx
│   │   │   │   └── ConceptSelector.tsx
│   │   │   ├── vendor/
│   │   │   │   ├── VendorCard.tsx
│   │   │   │   ├── VendorList.tsx
│   │   │   │   └── VendorFilter.tsx
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api-client.ts         # Backend API 클라이언트
│   │   │   ├── websocket.ts          # WebSocket 클라이언트
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useImageUpload.ts
│   │   │   └── useProcessingStatus.ts
│   │   ├── store/
│   │   │   └── useSimulatorStore.ts  # Zustand
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # NestJS Backend
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── upload/
│       │   │   ├── upload.module.ts
│       │   │   ├── upload.controller.ts
│       │   │   ├── upload.service.ts
│       │   │   └── dto/
│       │   │       ├── create-upload.dto.ts
│       │   │       └── upload-response.dto.ts
│       │   ├── processing/
│       │   │   ├── processing.module.ts
│       │   │   ├── processing.processor.ts   # BullMQ Worker
│       │   │   ├── processing.gateway.ts     # WebSocket
│       │   │   └── ai-client.service.ts      # 외부 AI API 래퍼
│       │   ├── vendor/
│       │   │   ├── vendor.module.ts
│       │   │   ├── vendor.controller.ts
│       │   │   ├── vendor.service.ts
│       │   │   └── dto/
│       │   ├── result/
│       │   │   ├── result.module.ts
│       │   │   ├── result.controller.ts
│       │   │   └── result.service.ts
│       │   ├── storage/
│       │   │   ├── storage.module.ts
│       │   │   └── s3.service.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   ├── prisma.service.ts
│       │   │   └── schema.prisma
│       │   └── common/
│       │       ├── filters/
│       │       ├── interceptors/
│       │       └── guards/
│       ├── test/
│       ├── nest-cli.json
│       └── package.json
│
├── packages/
│   ├── types/                        # 공유 TypeScript 타입
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── result.ts
│   │   └── vendor.ts
│   └── config/                       # 공유 설정
│       └── constants.ts
│
├── .github/
│   └── workflows/
│       ├── web-deploy.yml            # Vercel 배포
│       └── api-deploy.yml            # Railway 배포
│
├── docker-compose.yml                # 로컬 개발용 (PostgreSQL + Redis)
├── turbo.json                        # Turborepo 설정
├── package.json
└── pnpm-workspace.yaml
```

---

## 🚀 개발 단계

### Phase 1: 프로젝트 초기화 (1일)
- [x] 기술 스택 선정
- [ ] Monorepo 구조 생성 (Turborepo)
- [ ] Next.js 앱 초기화
- [ ] NestJS 앱 초기화
- [ ] Prisma 설정 및 스키마 작성
- [ ] Docker Compose (PostgreSQL + Redis)

### Phase 2: 이미지 업로드 기능 (2-3일)
- [ ] Frontend: ImageUploadForm 컴포넌트
- [ ] Frontend: react-dropzone 통합
- [ ] Backend: Multer 파일 업로드
- [ ] Backend: S3/R2 스토리지 연동
- [ ] Backend: 이미지 검증 로직
- [ ] 통합 테스트

### Phase 3: AI 처리 파이프라인 (3-4일)
- [ ] Backend: BullMQ 설정 및 Queue 구현
- [ ] Backend: Processing Worker 구현
- [ ] Backend: WebSocket Gateway 구현
- [ ] Frontend: WebSocket 클라이언트
- [ ] Frontend: ProcessingStatus 컴포넌트
- [ ] 외부 AI API 연동 인터페이스 (사용자 구현)

### Phase 4: 결과 표시 기능 (2일)
- [ ] Backend: Result API 구현
- [ ] Frontend: ResultGallery 컴포넌트
- [ ] Frontend: 이미지 비교 UI
- [ ] Frontend: 다운로드/공유 기능

### Phase 5: 업체 매칭 기능 (3-4일)
- [ ] Backend: Vendor CRUD API
- [ ] Frontend: 업체 목록 페이지
- [ ] Frontend: 업체 상세 페이지
- [ ] Frontend: 검색/필터 기능
- [ ] 업체 데이터 시딩

### Phase 6: 사용자 인증 (옵션, 2-3일)
- [ ] NextAuth.js 또는 Clerk 통합
- [ ] 사용자별 결과 관리
- [ ] 보호된 라우트

### Phase 7: 배포 및 최적화 (2-3일)
- [ ] Vercel 배포 (Frontend)
- [ ] Railway/Render 배포 (Backend)
- [ ] 환경변수 설정
- [ ] 이미지 CDN 최적화
- [ ] 성능 모니터링 (Sentry)

**예상 총 개발 기간**: 15-20일

---

## 🔐 환경변수 (초안)

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
```

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sdm"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=sdm-images

# External AI API (사용자가 설정)
AI_API_URL=https://your-ai-service.com
AI_API_KEY=your-api-key

# App
PORT=3001
NODE_ENV=development
```

---

## ⚠️ 고려사항 및 리스크

### 기술적 리스크
1. **AI 처리 시간**
   - 외부 AI API 응답 시간이 길 경우 (5분+)
   - 완화: BullMQ 타임아웃 설정, 사용자에게 예상 시간 안내

2. **이미지 용량**
   - 고해상도 이미지 업로드 시 메모리 부족
   - 완화: Sharp로 리사이징, 업로드 크기 제한 (10MB)

3. **동시 처리**
   - 다수 사용자 동시 요청 시 Queue 병목
   - 완화: Redis Bull Board로 모니터링, Worker 수평 확장

### 비즈니스 리스크
1. **AI API 비용**
   - 처리당 과금 모델일 경우 비용 급증
   - 완화: 무료 크레딧 제한, 사용자당 일일 제한

2. **업체 데이터**
   - 초기 업체 데이터 부족
   - 완화: 크롤링 또는 파트너십

---

## 📝 다음 단계
1. **Monorepo 초기화**: Turborepo + pnpm 설정 → [002_setup_todo.md]
2. **데이터베이스 설계 상세화**: Prisma 스키마 완성 → [003_database_structure.md]
3. **API 명세 작성**: REST + WebSocket 엔드포인트 → [004_api_spec.md]

---

## 🔗 관련 문서
- [Current Status](../../context/current.md)
- [Next: Setup Todo](../todo/002_setup_todo.md) (생성 예정)
