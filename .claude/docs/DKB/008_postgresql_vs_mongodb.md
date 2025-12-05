# 008: PostgreSQL vs MongoDB 비교 및 마이그레이션 영향

## 📋 개요
- **작성일**: 2025-12-05
- **카테고리**: Database
- **목적**: PostgreSQL과 MongoDB의 차이점 및 마이그레이션 시 변경사항 이해

## 🔍 핵심 차이점

### 1. 데이터 모델

#### PostgreSQL (관계형 DB)
```
테이블 기반 - 행(row)과 열(column)로 구성
├── User 테이블
│   ├── id (PK)
│   ├── email
│   └── name
├── Vendor 테이블
│   ├── id (PK)
│   ├── name
│   └── userId (FK) → User.id
└── VendorTag 테이블 (중간 테이블)
    ├── id (PK)
    ├── vendorId (FK) → Vendor.id
    └── tagId (FK) → Tag.id
```

#### MongoDB (문서 기반 DB)
```
컬렉션(Collection) - JSON 문서들의 집합
├── users 컬렉션
│   └── { _id, email, name }
├── vendors 컬렉션
│   └── {
│       _id,
│       name,
│       userId: ObjectId,
│       tags: [ObjectId, ObjectId]  ← 배열로 저장!
│   }
└── tags 컬렉션
    └── { _id, name, slug }
```

## 🔗 Many-to-Many 관계란?

### 현실 예시
```
스튜디오 A: #야외촬영, #한복, #실내
스튜디오 B: #야외촬영, #드레스, #실내
스튜디오 C: #한복, #드레스

→ 하나의 업체가 여러 태그를 가질 수 있고
→ 하나의 태그가 여러 업체에 속할 수 있음
```

### PostgreSQL 방식 (중간 테이블)
```sql
-- Vendor 테이블
id | name
1  | 스튜디오 A
2  | 스튜디오 B

-- Tag 테이블
id | name
10 | #야외촬영
20 | #한복

-- VendorTag 테이블 (중간 연결)
vendorId | tagId
1        | 10     (스튜디오 A - #야외촬영)
1        | 20     (스튜디오 A - #한복)
2        | 10     (스튜디오 B - #야외촬영)

-- 조회: 스튜디오 A의 태그 가져오기
SELECT t.* FROM Tag t
JOIN VendorTag vt ON t.id = vt.tagId
WHERE vt.vendorId = 1
```

### MongoDB 방식 (임베디드 or 참조 배열)

#### 방식 1: 태그 ID 배열 (Reference)
```javascript
// vendors 컬렉션
{
  _id: ObjectId("..."),
  name: "스튜디오 A",
  tagIds: [
    ObjectId("tag1"),
    ObjectId("tag2")
  ]
}

// tags 컬렉션
{
  _id: ObjectId("tag1"),
  name: "#야외촬영"
}

// 조회: 별도로 태그 정보 가져와야 함
const vendor = await db.vendors.findOne({ _id: ... })
const tags = await db.tags.find({ _id: { $in: vendor.tagIds } })
```

#### 방식 2: 태그 전체 임베디드 (Embedded)
```javascript
// vendors 컬렉션
{
  _id: ObjectId("..."),
  name: "스튜디오 A",
  tags: [
    { name: "#야외촬영", slug: "outdoor" },
    { name: "#한복", slug: "hanbok" }
  ]
}

// 장점: 한 번에 조회 (JOIN 불필요)
// 단점: 태그 정보 수정 시 모든 업체 문서 업데이트 필요
```

## 📊 현재 프로젝트의 Many-to-Many 관계

### 1. Vendor ↔ Tag
```prisma
model VendorTag {
  vendorId  String
  vendor    Vendor @relation(...)
  tagId     String
  tag       Tag    @relation(...)

  @@unique([vendorId, tagId])
}
```
**용도**: 업체에 태그 붙이기 (야외촬영, 한복, 드레스 등)

### 2. User ↔ Vendor (Favorite)
```prisma
model Favorite {
  userId    String
  user      User   @relation(...)
  vendorId  String
  vendor    Vendor @relation(...)

  @@unique([userId, vendorId])
}
```
**용도**: 사용자가 업체 찜하기

## 🔄 MongoDB로 바뀌면 어떻게 될까?

### 현재 Prisma + PostgreSQL 코드
```typescript
// Vendor를 태그와 함께 조회
const vendor = await prisma.vendor.findUnique({
  where: { id: 'vendor123' },
  include: {
    tags: {
      include: {
        tag: true  // VendorTag를 통해 Tag 정보 가져옴
      }
    }
  }
})

// 결과
{
  id: 'vendor123',
  name: '스튜디오 A',
  tags: [
    { tag: { name: '#야외촬영', slug: 'outdoor' } },
    { tag: { name: '#한복', slug: 'hanbok' } }
  ]
}
```

### MongoDB로 전환 후 (방식 1: 참조 배열)
```typescript
// Prisma + MongoDB는 중간 테이블 지원 안 함!
// 직접 배열로 관리해야 함

model Vendor {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  name    String
  tagIds  String[] @db.ObjectId  // 태그 ID 배열
}

// 조회 코드 변경 필요
const vendor = await prisma.vendor.findUnique({
  where: { id: 'vendor123' }
})

// 태그는 별도로 조회
const tags = await prisma.tag.findMany({
  where: {
    id: { in: vendor.tagIds }
  }
})

// 또는 aggregation pipeline 사용 (복잡!)
```

### MongoDB로 전환 후 (방식 2: 임베디드)
```typescript
model Vendor {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  name  String
  tags  Json   // { name, slug }[] 배열을 JSON으로 저장
}

// 조회 - 한 번에 가능!
const vendor = await prisma.vendor.findUnique({
  where: { id: 'vendor123' }
})
// vendor.tags에 이미 모든 정보 포함

// 하지만 문제점:
// 1. 태그 정보 수정 시 모든 업체 문서 업데이트 필요
// 2. 태그로 업체 검색이 복잡함
```

## ⚠️ Prisma + MongoDB 제한사항

### 1. Many-to-Many 미지원
```prisma
// ❌ PostgreSQL에서는 가능
model VendorTag {
  vendor   Vendor @relation(...)
  tag      Tag    @relation(...)
  @@id([vendorId, tagId])
}

// ✅ MongoDB에서는 불가능 - 직접 배열로 관리
model Vendor {
  tagIds String[] @db.ObjectId
}
```

### 2. 제한적인 `include` (Population)
```typescript
// PostgreSQL - 자동 JOIN
const vendors = await prisma.vendor.findMany({
  include: {
    category: true,
    tags: { include: { tag: true } },
    images: true
  }
})

// MongoDB - 일부만 지원
const vendors = await prisma.vendor.findMany({
  include: {
    category: true,  // ✅ 1:N 관계는 OK
    images: true     // ✅ 1:N 관계는 OK
    // tags: ❌ M:N은 수동 처리
  }
})
```

### 3. Transaction 제한
```typescript
// PostgreSQL - 완전한 트랜잭션
await prisma.$transaction([
  prisma.user.create({ ... }),
  prisma.vendor.create({ ... }),
  prisma.booking.create({ ... })
])

// MongoDB - 제한적 지원 (Replica Set 필요)
// 단일 문서 수정은 atomic하지만 여러 컬렉션 걸친 트랜잭션은 복잡
```

### 4. Enum 미지원
```prisma
// PostgreSQL
enum UserRole {
  CUSTOMER
  VENDOR
  ADMIN
}

// MongoDB - String으로 변경 필요
model User {
  role String  // "CUSTOMER" | "VENDOR" | "ADMIN"
}
```

## 🎯 실제 마이그레이션 시 변경되는 부분

### 변경 1: ID 필드
```prisma
// Before (PostgreSQL)
model User {
  id String @id @default(cuid())  // "ckx..."
}

// After (MongoDB)
model User {
  id String @id @default(auto()) @map("_id") @db.ObjectId  // ObjectId
}
```

### 변경 2: VendorTag 재설계
```prisma
// Before (PostgreSQL) - 중간 테이블
model Vendor {
  tags VendorTag[]
}

model Tag {
  vendors VendorTag[]
}

model VendorTag {
  vendor   Vendor @relation(...)
  tag      Tag    @relation(...)
  @@unique([vendorId, tagId])
}

// After (MongoDB) - Option A: 참조 배열
model Vendor {
  tagIds String[] @db.ObjectId
}

model Tag {
  id String @id @default(auto()) @map("_id") @db.ObjectId
}

// 또는 Option B: 임베디드
model Vendor {
  tags Json  // [{ name, slug }, ...]
}
```

### 변경 3: Favorite 재설계
```prisma
// Before (PostgreSQL)
model Favorite {
  user     User   @relation(...)
  vendor   Vendor @relation(...)
  @@unique([userId, vendorId])
}

// After (MongoDB) - Option A: 사용자에 업체 ID 배열
model User {
  favoriteVendorIds String[] @db.ObjectId
}

// Option B: 별도 컬렉션 유지 (비효율적)
model Favorite {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  userId   String @db.ObjectId
  vendorId String @db.ObjectId
}
```

### 변경 4: Enum → String
```prisma
// Before
enum SimulationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model SimulationResult {
  status SimulationStatus @default(PENDING)
}

// After
model SimulationResult {
  status String @default("PENDING")
  // "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
}
```

### 변경 5: 서비스 코드 변경
```typescript
// Before (PostgreSQL) - 자동 JOIN
async findVendorWithTags(id: string) {
  return this.prisma.vendor.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })
}

// After (MongoDB - 참조 배열)
async findVendorWithTags(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: { id }
  })

  const tags = await this.prisma.tag.findMany({
    where: {
      id: { in: vendor.tagIds }
    }
  })

  return { ...vendor, tags }
}

// After (MongoDB - 임베디드)
async findVendorWithTags(id: string) {
  // 한 번에 조회 가능!
  return this.prisma.vendor.findUnique({
    where: { id }
  })
  // vendor.tags에 이미 포함됨
}
```

## 💡 권장 설계 (MongoDB 선택 시)

### Vendor 스키마 예시
```prisma
model Vendor {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId

  categoryId      String   @db.ObjectId
  category        VendorCategory @relation(...)

  name            String
  slug            String   @unique
  description     String?

  // 태그: 임베디드 방식 (검색 빈도 낮음)
  tags            Json     // [{ id, name, slug }]

  // 이미지: 임베디드 방식 (항상 함께 조회)
  images          Json     // [{ url, type, order }]

  // 메타데이터 (MongoDB 장점 활용!)
  metadata        Json?    // 업체별 다른 필드 가능

  location        String
  coordinates     Json?    // { lat: 37.123, lng: 127.456 }

  priceMin        Int?
  priceMax        Int?

  rating          Float    @default(0)
  reviewCount     Int      @default(0)

  isActive        Boolean  @default(true)
  isPremium       Boolean  @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // 1:N 관계는 유지 가능
  reviews         Review[]
  bookings        Booking[]

  @@index([categoryId])
  @@index([slug])
  @@index([location])
}
```

### User 스키마 예시
```prisma
model User {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  email             String   @unique
  name              String?

  role              String   @default("CUSTOMER")

  // Favorite: 배열로 간단히
  favoriteVendorIds String[] @db.ObjectId

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  simulationResults SimulationResult[]
  reviews           Review[]
  bookings          Booking[]
}
```

## 📈 성능 비교

### PostgreSQL 장점
- ✅ 복잡한 JOIN 쿼리 최적화
- ✅ ACID 트랜잭션 완벽 지원
- ✅ 외래 키 제약조건 (데이터 무결성)
- ✅ Prisma 완전 지원

### MongoDB 장점
- ✅ 유연한 스키마 (metadata 같은 JSON)
- ✅ 수평 확장 (Sharding)
- ✅ 임베디드 문서 (JOIN 없이 조회)
- ✅ 배열 필드 쿼리 (태그, 이미지)

### 현재 프로젝트 적합도

| 기능 | PostgreSQL | MongoDB |
|------|-----------|---------|
| Vendor metadata | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| User-Vendor 관계 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 결제/예약 시스템 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 태그 검색 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Prisma 지원 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 수평 확장 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎯 결론

### MongoDB 선택이 좋은 경우
- 업체별 속성이 매우 다양함 (metadata 활용)
- 대규모 확장 계획 (수백만 업체)
- 복잡한 트랜잭션 불필요
- NoSQL 경험 쌓고 싶음

### PostgreSQL 유지가 좋은 경우
- 결제/예약 시스템 중요
- 복잡한 관계 쿼리 많음
- Prisma 완전 기능 활용
- 현재도 JSON 필드로 충분히 유연함

## 📚 참고 문서
- [007_mongodb_migration_plan.md](../plan/007_mongodb_migration_plan.md)
- [003_database_schema.md](../structure/003_database_schema.md)
- [006_prisma_basics.md](006_prisma_basics.md)
- [Prisma MongoDB 공식 문서](https://www.prisma.io/docs/orm/overview/databases/mongodb)
