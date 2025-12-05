# 005_nestjs_basics.md - NestJS 기본 개념

**생성일**: 2025-12-05
**카테고리**: Backend Framework
**난이도**: 초급
**관련 문서**: [001_initial_plan.md](../plan/001_initial_plan.md)

---

## 📚 NestJS란?

NestJS는 TypeScript 기반의 Node.js 백엔드 프레임워크입니다.
- **철학**: Angular와 유사한 아키텍처 (Dependency Injection, Decorators)
- **장점**: 구조화된 코드, 타입 안전성, 확장성
- **기반**: Express.js (또는 Fastify)

---

## 🏗️ 핵심 구성 요소

### 1. Module (모듈)
**개념**: 관련된 기능을 하나로 묶는 단위

```typescript
// upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [],      // 다른 모듈 가져오기
  controllers: [UploadController],  // HTTP 요청 처리
  providers: [UploadService],       // 비즈니스 로직
  exports: [UploadService],         // 다른 모듈에서 사용 가능하게
})
export class UploadModule {}
```

**역할**:
- 기능별로 코드 분리 (Upload, Vendor, Processing 등)
- 각 모듈은 독립적이지만 서로 import 가능

**우리 프로젝트 구조**:
```
apps/api/src/
├── app.module.ts           # 루트 모듈 (모든 모듈 통합)
├── config/config.module.ts # 환경변수 설정
├── prisma/prisma.module.ts # DB 연결
├── upload/upload.module.ts # 이미지 업로드
├── vendor/vendor.module.ts # 업체 관리
└── result/result.module.ts # 결과 조회
```

---

### 2. Controller (컨트롤러)
**개념**: HTTP 요청을 받아 적절한 Service로 전달

```typescript
// upload.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')  // /api/upload 경로
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // POST /api/upload
  @Post()
  async upload(@Body() data: any) {
    return this.uploadService.handleUpload(data);
  }

  // GET /api/upload/:id
  @Get(':id')
  async getStatus(@Param('id') id: string) {
    return this.uploadService.getStatus(id);
  }
}
```

**주요 데코레이터**:
| 데코레이터 | 용도 | 예시 |
|-----------|------|------|
| `@Controller('path')` | 기본 경로 설정 | `@Controller('vendors')` → `/api/vendors` |
| `@Get()` | GET 요청 | `@Get()` → GET /api/upload |
| `@Post()` | POST 요청 | `@Post()` → POST /api/upload |
| `@Put(':id')` | PUT 요청 | `@Put(':id')` → PUT /api/upload/123 |
| `@Delete(':id')` | DELETE 요청 | `@Delete(':id')` → DELETE /api/upload/123 |
| `@Param('id')` | URL 파라미터 | `/upload/:id` → `@Param('id')` |
| `@Body()` | 요청 본문 | POST 데이터 |
| `@Query()` | 쿼리 파라미터 | `?page=1` → `@Query('page')` |

---

### 3. Service (서비스)
**개념**: 비즈니스 로직을 담당 (DB 조회, 계산, 외부 API 호출 등)

```typescript
// upload.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async handleUpload(data: any) {
    // 1. DB에 레코드 생성
    const result = await this.prisma.simulationResult.create({
      data: {
        userId: data.userId,
        groomImageUrl: data.groomUrl,
        brideImageUrl: data.brideUrl,
        status: 'PENDING',
      },
    });

    // 2. 큐에 작업 추가 (나중에 구현)
    // await this.queue.add('process-image', { resultId: result.id });

    return { resultId: result.id };
  }

  async getStatus(id: string) {
    return this.prisma.simulationResult.findUnique({
      where: { id },
    });
  }
}
```

**특징**:
- `@Injectable()` 데코레이터 필수 (Dependency Injection 가능)
- Controller에서 주입받아 사용
- 다른 Service도 주입 가능 (PrismaService, StorageService 등)

---

### 4. Provider (프로바이더)
**개념**: Service를 포함한 모든 주입 가능한 클래스

```typescript
@Module({
  providers: [
    UploadService,      // 일반 Service
    PrismaService,      // DB Service
    StorageService,     // 스토리지 Service
  ],
})
```

**Dependency Injection 작동 방식**:
```typescript
// 1. Module에 등록
@Module({
  providers: [UploadService, PrismaService],
})

// 2. Constructor에서 주입
export class UploadService {
  constructor(
    private prisma: PrismaService,  // 자동 주입!
  ) {}
}
```

---

## 🔄 요청 흐름 (Request Flow)

```
사용자 → Controller → Service → Database
                          ↓
                       응답 반환
```

**예시: 이미지 업로드**
```
1. POST /api/upload { userId, groomUrl, brideUrl }
   ↓
2. UploadController.upload() 호출
   ↓
3. UploadService.handleUpload() 호출
   ↓
4. PrismaService로 DB 저장
   ↓
5. { resultId: "abc123" } 응답
```

---

## 🌍 Global Module

**문제**: 모든 모듈에서 PrismaService를 사용하려면 매번 import?

**해결**: Global Module 사용

```typescript
// prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // 이 모듈을 전역으로!
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**결과**:
- `AppModule`에서 한 번만 import
- 모든 모듈에서 `PrismaService` 사용 가능

---

## 📝 DTO (Data Transfer Object)

**개념**: API 요청/응답의 구조를 정의하고 유효성 검증

```typescript
// upload/dto/create-upload.dto.ts
import { IsString, IsUrl } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  userId: string;

  @IsUrl()
  groomImageUrl: string;

  @IsUrl()
  brideImageUrl: string;

  @IsString()
  concept?: string;
}
```

**Controller에서 사용**:
```typescript
@Post()
async upload(@Body() dto: CreateUploadDto) {
  // dto.userId, dto.groomImageUrl 등 타입 안전!
  return this.uploadService.handleUpload(dto);
}
```

**자동 검증**:
```typescript
// main.ts에서 설정
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,        // DTO에 없는 필드 제거
    transform: true,        // 타입 자동 변환
    forbidNonWhitelisted: true,  // 허용되지 않은 필드 에러
  }),
);
```

---

## 🔧 Middleware, Guard, Interceptor

### Middleware
**역할**: 요청/응답 전처리 (로깅, CORS 등)

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### Guard
**역할**: 인증/인가 체크

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization !== undefined;
  }
}
```

### Interceptor
**역할**: 응답 변환, 캐싱, 에러 핸들링

```typescript
// transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

---

## 🚀 실전 예제: Vendor API

```typescript
// vendor.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // GET /api/vendors?category=studio&page=1
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('page') page?: number,
  ) {
    return this.vendorService.findAll({ category, page });
  }

  // GET /api/vendors/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  // POST /api/vendors
  @Post()
  async create(@Body() dto: CreateVendorDto) {
    return this.vendorService.create(dto);
  }
}
```

```typescript
// vendor.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { category?: string; page?: number }) {
    const where = filters.category
      ? { category: { slug: filters.category } }
      : {};

    return this.prisma.vendor.findMany({
      where,
      include: { category: true, images: true },
      take: 20,
      skip: (filters.page || 0) * 20,
    });
  }

  async findOne(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        reviews: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(data: any) {
    return this.prisma.vendor.create({ data });
  }
}
```

---

## 💡 학습 순서 추천

1. **기본 개념** (1시간)
   - Module, Controller, Service 이해
   - Dependency Injection 원리

2. **간단한 API 만들기** (2시간)
   - GET /vendors 구현
   - POST /vendors 구현
   - Prisma 연동

3. **심화** (3시간)
   - DTO + Validation
   - Guard (인증)
   - Interceptor (응답 변환)

4. **실전** (이후)
   - WebSocket (실시간 통신)
   - BullMQ (큐)
   - 파일 업로드 (Multer)

---

## 🔗 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [NestJS 한국어 문서](https://docs.nestjs.kr/)
- 우리 프로젝트 예시:
  - [upload.controller.ts](../../../apps/api/src/upload/upload.controller.ts)
  - [vendor.service.ts](../../../apps/api/src/vendor/vendor.service.ts)

---

## 📊 학습 체크리스트

- [ ] Module, Controller, Service 개념 이해
- [ ] Dependency Injection 작동 방식 파악
- [ ] @Get, @Post 데코레이터 사용법
- [ ] PrismaService 주입 및 사용
- [ ] DTO 작성 및 검증
- [ ] 간단한 CRUD API 구현

---

**다음 문서**: [006_prisma_basics.md](./006_prisma_basics.md) - Prisma ORM 기본
