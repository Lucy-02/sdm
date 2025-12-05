# 006_prisma_basics.md - Prisma ORM 기본 개념

**생성일**: 2025-12-05
**카테고리**: Database ORM
**난이도**: 초급
**관련 문서**: [005_nestjs_basics.md](./005_nestjs_basics.md)

---

## 📚 Prisma란?

Prisma는 TypeScript/JavaScript용 차세대 ORM입니다.
- **장점**: 타입 안전성, 직관적인 쿼리, 자동 마이그레이션
- **구성**: Schema → Migrate → Client
- **경쟁자**: TypeORM, Sequelize (하지만 Prisma가 훨씬 편함!)

---

## 🏗️ Prisma 3가지 도구

### 1. Prisma Schema
**파일**: `prisma/schema.prisma`
**역할**: DB 구조를 선언적으로 정의

```prisma
// User 테이블 정의
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())

  // Relation
  results   SimulationResult[]
}
```

### 2. Prisma Migrate
**명령어**: `npx prisma migrate dev`
**역할**: Schema를 실제 DB에 적용 (마이그레이션)

```bash
# 마이그레이션 생성 및 적용
npx prisma migrate dev --name init

# 프로덕션 배포
npx prisma migrate deploy
```

### 3. Prisma Client
**명령어**: `npx prisma generate`
**역할**: Schema 기반으로 타입 안전한 쿼리 클라이언트 자동 생성

```typescript
// 자동 생성된 클라이언트 사용
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' },
});
// user.id, user.email 모두 타입 안전!
```

---

## 📝 Schema 문법

### 기본 구조
```prisma
// 1. Generator: Client 생성 설정
generator client {
  provider = "prisma-client-js"
}

// 2. Datasource: DB 연결 설정
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3. Model: 테이블 정의
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}
```

### 데이터 타입
| Prisma 타입 | PostgreSQL | TypeScript | 예시 |
|------------|-----------|------------|------|
| `String` | TEXT/VARCHAR | string | `name String` |
| `Int` | INTEGER | number | `age Int` |
| `Float` | DOUBLE | number | `rating Float` |
| `Boolean` | BOOLEAN | boolean | `isActive Boolean` |
| `DateTime` | TIMESTAMP | Date | `createdAt DateTime` |
| `Json` | JSONB | any | `metadata Json?` |
| `Enum` | ENUM | enum | `role UserRole` |

### 필드 속성

#### 기본 속성
```prisma
model User {
  id    String  @id                    // Primary Key
  email String  @unique                // Unique 제약
  name  String?                        // Optional (null 가능)
  age   Int     @default(0)            // 기본값

  createdAt DateTime @default(now())   // 현재 시간
  updatedAt DateTime @updatedAt        // 자동 업데이트
}
```

#### 데이터베이스 속성
```prisma
model Post {
  id      String @id @default(cuid())
  title   String
  content String @db.Text              // 긴 텍스트

  @@index([title])                     // 인덱스
  @@unique([title, authorId])          // 복합 Unique
}
```

---

## 🔗 Relation (관계)

### 1:N 관계 (One-to-Many)
```prisma
model User {
  id      String   @id @default(cuid())
  email   String   @unique

  // 한 명의 사용자는 여러 개의 결과를 가질 수 있음
  results SimulationResult[]
}

model SimulationResult {
  id              String @id @default(cuid())
  userId          String
  groomImageUrl   String

  // 외래키 관계
  user            User   @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

**생성된 SQL**:
```sql
CREATE TABLE "SimulationResult" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "groomImageUrl" TEXT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
);
```

### N:M 관계 (Many-to-Many)
```prisma
model Vendor {
  id   String      @id @default(cuid())
  name String

  // 중간 테이블 사용
  tags VendorTag[]
}

model Tag {
  id      String      @id @default(cuid())
  name    String

  vendors VendorTag[]
}

// 중간 테이블
model VendorTag {
  id       String @id @default(cuid())
  vendorId String
  vendor   Vendor @relation(fields: [vendorId], references: [id])
  tagId    String
  tag      Tag    @relation(fields: [tagId], references: [id])

  @@unique([vendorId, tagId])
}
```

### Cascade 삭제
```prisma
model User {
  id      String   @id @default(cuid())
  results SimulationResult[]
}

model SimulationResult {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // User 삭제 시 관련 SimulationResult도 자동 삭제
}
```

---

## 🔍 Prisma Client 쿼리

### CRUD 기본

#### Create (생성)
```typescript
// 단일 생성
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
  },
});

// 관계와 함께 생성
const result = await prisma.simulationResult.create({
  data: {
    groomImageUrl: 'https://...',
    brideImageUrl: 'https://...',
    user: {
      connect: { id: userId },  // 기존 User 연결
    },
  },
});
```

#### Read (조회)
```typescript
// ID로 단일 조회
const user = await prisma.user.findUnique({
  where: { id: 'user123' },
});

// 조건으로 단일 조회
const user = await prisma.user.findFirst({
  where: { email: 'test@example.com' },
});

// 여러 개 조회
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@gmail.com' },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,  // LIMIT
  skip: 20,  // OFFSET
});

// 관계 포함 조회 (JOIN)
const user = await prisma.user.findUnique({
  where: { id: 'user123' },
  include: {
    results: true,           // 모든 results
    reviews: {
      take: 5,               // 최근 5개만
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

#### Update (수정)
```typescript
// 단일 수정
const updated = await prisma.simulationResult.update({
  where: { id: 'result123' },
  data: {
    status: 'COMPLETED',
    outputImageUrl: 'https://...',
  },
});

// 여러 개 수정
const { count } = await prisma.user.updateMany({
  where: { isActive: false },
  data: { isActive: true },
});
```

#### Delete (삭제)
```typescript
// 단일 삭제
await prisma.user.delete({
  where: { id: 'user123' },
});

// 여러 개 삭제
await prisma.simulationResult.deleteMany({
  where: { status: 'FAILED' },
});
```

---

### 고급 쿼리

#### 필터링
```typescript
const vendors = await prisma.vendor.findMany({
  where: {
    // AND 조건
    isActive: true,
    rating: { gte: 4.0 },  // >=

    // OR 조건
    OR: [
      { priceMin: { lte: 100 } },  // <=
      { isPremium: true },
    ],

    // 문자열 검색
    name: { contains: '스튜디오' },

    // 관계 필터
    category: {
      slug: 'studio',
    },
  },
});
```

**필터 연산자**:
| 연산자 | 의미 | 예시 |
|--------|------|------|
| `equals` | 같음 | `{ age: { equals: 30 } }` |
| `not` | 아님 | `{ status: { not: 'FAILED' } }` |
| `in` | 포함 | `{ id: { in: ['a', 'b'] } }` |
| `notIn` | 불포함 | `{ role: { notIn: ['ADMIN'] } }` |
| `lt` / `lte` | < / <= | `{ age: { lt: 30 } }` |
| `gt` / `gte` | > / >= | `{ price: { gte: 100 } }` |
| `contains` | 문자열 포함 | `{ name: { contains: '김' } }` |
| `startsWith` | 시작 | `{ email: { startsWith: 'test' } }` |

#### Pagination
```typescript
// 페이지네이션
const page = 2;
const pageSize = 20;

const [vendors, total] = await Promise.all([
  prisma.vendor.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { createdAt: 'desc' },
  }),
  prisma.vendor.count(),
]);

const totalPages = Math.ceil(total / pageSize);
```

#### Aggregation (집계)
```typescript
// 평균 평점 계산
const stats = await prisma.review.aggregate({
  where: { vendorId: 'vendor123' },
  _avg: { rating: true },
  _count: { id: true },
});
console.log(stats._avg.rating);  // 4.2
console.log(stats._count.id);    // 150

// 그룹별 집계
const categoryStats = await prisma.vendor.groupBy({
  by: ['categoryId'],
  _count: { id: true },
  _avg: { rating: true },
});
```

---

## 🔧 NestJS에서 Prisma 사용

### 1. PrismaService 생성
```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();  // 앱 시작 시 DB 연결
  }

  async onModuleDestroy() {
    await this.$disconnect();  // 앱 종료 시 DB 연결 해제
  }
}
```

### 2. Module에 등록
```typescript
// prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 3. Service에서 사용
```typescript
// vendor/vendor.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vendor.findMany({
      include: { category: true, images: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
    });
  }
}
```

---

## 🚀 마이그레이션 워크플로우

### 개발 환경
```bash
# 1. Schema 수정 (schema.prisma)
# 2. 마이그레이션 생성 및 적용
npx prisma migrate dev --name add_vendor_category

# 3. Prisma Client 재생성 (자동)
# 4. 서버 재시작
```

### 프로덕션 환경
```bash
# 마이그레이션만 적용 (롤백 없음!)
npx prisma migrate deploy
```

### 유용한 명령어
```bash
# DB 초기화 (데이터 전부 삭제!)
npx prisma migrate reset

# Schema 포맷팅
npx prisma format

# DB 데이터 GUI로 보기
npx prisma studio
```

---

## 💡 실전 예제: 업체 검색 API

```typescript
// vendor.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async search(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    page?: number;
  }) {
    const { category, location, minPrice, maxPrice, tags, page = 1 } = filters;
    const pageSize = 20;

    const where: any = {
      isActive: true,
    };

    // 카테고리 필터
    if (category) {
      where.category = { slug: category };
    }

    // 지역 필터
    if (location) {
      where.location = { contains: location };
    }

    // 가격 필터
    if (minPrice || maxPrice) {
      where.priceMin = {};
      if (minPrice) where.priceMin.gte = minPrice;
      if (maxPrice) where.priceMax = { lte: maxPrice };
    }

    // 태그 필터
    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: { in: tags },
          },
        },
      };
    }

    // 쿼리 실행
    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { type: 'THUMBNAIL' },
            take: 1,
          },
          tags: {
            include: { tag: true },
          },
        },
        orderBy: [
          { isPremium: 'desc' },  // 프리미엄 우선
          { rating: 'desc' },     // 평점 높은 순
        ],
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      vendors,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
```

---

## ⚠️ 주의사항

### 1. N+1 쿼리 문제
❌ **나쁜 예**:
```typescript
const users = await prisma.user.findMany();
for (const user of users) {
  // 각 user마다 쿼리 1회 = N+1 문제!
  const results = await prisma.simulationResult.findMany({
    where: { userId: user.id },
  });
}
```

✅ **좋은 예**:
```typescript
const users = await prisma.user.findMany({
  include: {
    results: true,  // JOIN으로 한 번에 가져오기
  },
});
```

### 2. Transaction 사용
```typescript
// 여러 작업을 원자적으로 실행
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'test@example.com' },
  });

  await tx.simulationResult.create({
    data: {
      userId: user.id,
      groomImageUrl: 'https://...',
      brideImageUrl: 'https://...',
    },
  });
});
```

---

## 📊 학습 체크리스트

- [ ] Schema 문법 이해 (model, relation, enum)
- [ ] Prisma Migrate 워크플로우 파악
- [ ] CRUD 쿼리 작성 (create, findMany, update, delete)
- [ ] 관계 조회 (include) 사용
- [ ] 필터링 (where, orderBy, take, skip)
- [ ] NestJS에서 PrismaService 주입 및 사용

---

**이전 문서**: [005_nestjs_basics.md](./005_nestjs_basics.md) - NestJS 기본
**다음 문서**: 실전 구현 (Upload, Vendor API)
