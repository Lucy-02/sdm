# 002_setup_todo.md - 프로젝트 초기 설정 Todo

**생성일**: 2025-12-04
**상태**: 진행중
**관련 문서**:
- [001_initial_plan.md](../plan/001_initial_plan.md)
- [Current Status](../../context/current.md)

---

## 📋 Phase 1: 프로젝트 초기화

### 1️⃣ Monorepo 기본 구조 생성
- [ ] **pnpm workspace 설정**
  - `pnpm-workspace.yaml` 생성
  - 루트 `package.json` 설정
  - `.npmrc` 설정 (shamefully-hoist=true)

- [ ] **Turborepo 설정**
  - `turbo.json` 생성
  - 파이프라인 정의 (build, dev, lint, test)
  - 캐시 전략 설정

- [ ] **기본 디렉토리 구조**
  ```
  sdm/
  ├── apps/
  │   ├── web/     (생성 예정)
  │   └── api/     (생성 예정)
  ├── packages/
  │   ├── types/   (생성 예정)
  │   └── config/  (생성 예정)
  └── .claude/     (이미 존재)
  ```

- [ ] **공통 설정 파일**
  - `.gitignore` (Node.js + Next.js + NestJS)
  - `.editorconfig`
  - `.prettierrc`
  - `tsconfig.base.json`

**예상 시간**: 30분

---

### 2️⃣ Frontend - Next.js 15 초기화

- [ ] **Next.js 앱 생성**
  ```bash
  cd apps/
  pnpm create next-app web --typescript --tailwind --app --no-src-dir
  ```

- [ ] **패키지 설치**
  - TypeScript 설정
  - Tailwind CSS (이미 포함)
  - shadcn/ui 초기화
    ```bash
    pnpm dlx shadcn@latest init
    ```
  - 추가 라이브러리:
    - `zustand` (상태 관리)
    - `react-hook-form` + `zod` (폼 관리)
    - `react-dropzone` (이미지 업로드)
    - `socket.io-client` (WebSocket)
    - `axios` (HTTP 클라이언트)

- [ ] **기본 컴포넌트 설치 (shadcn/ui)**
  ```bash
  pnpm dlx shadcn@latest add button card input label
  pnpm dlx shadcn@latest add toast dialog progress
  ```

- [ ] **디렉토리 구조 생성**
  ```
  apps/web/
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx
  │   ├── vendors/
  │   ├── my-results/
  │   └── api/
  ├── components/
  │   ├── simulator/
  │   ├── vendor/
  │   └── ui/
  ├── lib/
  ├── hooks/
  └── store/
  ```

- [ ] **환경변수 설정**
  - `.env.local` 생성
  - `NEXT_PUBLIC_API_URL` 설정

**예상 시간**: 1시간

---

### 3️⃣ Backend - NestJS 초기화

- [ ] **NestJS 앱 생성**
  ```bash
  cd apps/
  nest new api
  # package manager 선택: pnpm
  ```

- [ ] **패키지 설치**
  - Core:
    - `@nestjs/config` (환경변수)
    - `@nestjs/platform-socket.io` (WebSocket)
    - `@nestjs/bull` + `bull` + `bullmq` (Queue)
  - Database:
    - `@prisma/client` + `prisma` (ORM)
  - File Upload:
    - `@nestjs/platform-express` (Multer 포함)
    - `multer-s3` (S3 업로드)
    - `aws-sdk` 또는 `@aws-sdk/client-s3`
  - Validation:
    - `class-validator` + `class-transformer`
  - Image:
    - `sharp` (이미지 처리)

- [ ] **모듈 구조 생성**
  ```bash
  nest g module upload
  nest g module processing
  nest g module vendor
  nest g module result
  nest g module storage
  nest g module prisma
  ```

- [ ] **디렉토리 구조 정리**
  ```
  apps/api/src/
  ├── main.ts
  ├── app.module.ts
  ├── upload/
  ├── processing/
  ├── vendor/
  ├── result/
  ├── storage/
  ├── prisma/
  └── common/
  ```

- [ ] **환경변수 설정**
  - `.env` 생성
  - `DATABASE_URL`, `REDIS_HOST`, AWS 키 등

**예상 시간**: 1시간

---

### 4️⃣ Database - Prisma 설정

- [ ] **Prisma 초기화**
  ```bash
  cd apps/api
  pnpm prisma init
  ```

- [ ] **스키마 작성**
  - `prisma/schema.prisma` 편집
  - 모델 정의:
    - User
    - Result
    - Vendor
    - (추가 모델은 나중에)

- [ ] **Prisma Client 생성**
  ```bash
  pnpm prisma generate
  ```

- [ ] **Prisma Service 생성**
  ```typescript
  // src/prisma/prisma.service.ts
  import { Injectable, OnModuleInit } from '@nestjs/common';
  import { PrismaClient } from '@prisma/client';

  @Injectable()
  export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
      await this.$connect();
    }
  }
  ```

**예상 시간**: 30분

---

### 5️⃣ 로컬 개발 환경 - Docker Compose

- [ ] **docker-compose.yml 작성**
  ```yaml
  version: '3.8'
  services:
    postgres:
      image: postgres:16
      ports:
        - "5432:5432"
      environment:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: sdm
      volumes:
        - postgres_data:/var/lib/postgresql/data

    redis:
      image: redis:7-alpine
      ports:
        - "6379:6379"
      volumes:
        - redis_data:/data

  volumes:
    postgres_data:
    redis_data:
  ```

- [ ] **Docker Compose 실행**
  ```bash
  docker-compose up -d
  ```

- [ ] **DB 마이그레이션 실행**
  ```bash
  cd apps/api
  pnpm prisma migrate dev --name init
  ```

**예상 시간**: 20분

---

### 6️⃣ 공유 패키지 설정

- [ ] **packages/types 생성**
  ```bash
  mkdir -p packages/types
  cd packages/types
  pnpm init
  ```
  - `package.json` 설정
    ```json
    {
      "name": "@sdm/types",
      "version": "0.0.1",
      "main": "./index.ts",
      "types": "./index.ts"
    }
    ```
  - `index.ts` 생성 (공통 타입 export)
  - `tsconfig.json` 생성

- [ ] **packages/config 생성**
  - 공통 상수 정의
  - 환경변수 타입 정의

**예상 시간**: 20분

---

### 7️⃣ 통합 및 검증

- [ ] **Turbo 빌드 테스트**
  ```bash
  pnpm turbo build
  ```

- [ ] **개발 서버 실행**
  ```bash
  pnpm turbo dev
  ```
  - Frontend: http://localhost:3000
  - Backend: http://localhost:3001

- [ ] **타입 공유 확인**
  - `packages/types`에서 타입 정의
  - Frontend/Backend에서 import 테스트

- [ ] **DB 연결 확인**
  ```bash
  cd apps/api
  pnpm prisma studio
  ```

**예상 시간**: 30분

---

## 📊 체크리스트 요약

### 필수 완료 항목
- [ ] pnpm workspace + Turborepo 설정
- [ ] Next.js 앱 생성 및 기본 패키지 설치
- [ ] NestJS 앱 생성 및 모듈 구조
- [ ] Prisma 스키마 작성 및 마이그레이션
- [ ] Docker Compose로 PostgreSQL + Redis 실행
- [ ] 공유 타입 패키지 설정
- [ ] 통합 빌드 및 dev 서버 실행 확인

### 선택적 항목
- [ ] shadcn/ui 테마 커스터마이징
- [ ] ESLint/Prettier 규칙 세부 조정
- [ ] GitHub Actions CI/CD 초기 설정

---

## 🚀 다음 단계

설정 완료 후:
1. **003_database_structure.md** - Prisma 스키마 상세화
2. **004_upload_feature_todo.md** - 이미지 업로드 기능 구현
3. **005_processing_pipeline_todo.md** - AI 처리 파이프라인 구현

---

## 🔗 관련 문서
- [001_initial_plan.md](../plan/001_initial_plan.md)
- [Current Status](../../context/current.md)

---

## 📝 실행 명령어 요약

```bash
# 1. Monorepo 초기화
pnpm init
pnpm add -Dw turbo prettier eslint

# 2. Frontend 생성
cd apps
pnpm create next-app web --typescript --tailwind --app
cd web
pnpm add zustand react-hook-form zod react-dropzone socket.io-client axios
pnpm dlx shadcn@latest init

# 3. Backend 생성
cd ../
nest new api
cd api
pnpm add @nestjs/config @nestjs/platform-socket.io @nestjs/bull bull bullmq
pnpm add @prisma/client prisma aws-sdk sharp
pnpm add class-validator class-transformer

# 4. Prisma 설정
pnpm prisma init
# schema.prisma 편집 후
pnpm prisma generate
pnpm prisma migrate dev --name init

# 5. Docker Compose
docker-compose up -d

# 6. 개발 서버 실행 (루트에서)
pnpm turbo dev
```
