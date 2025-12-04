# 003_database_schema.md - 확장 가능한 데이터베이스 스키마

**생성일**: 2025-12-04
**상태**: 진행중
**관련 문서**:
- [001_initial_plan.md](../plan/001_initial_plan.md)
- [002_setup_todo.md](../todo/002_setup_todo.md)

---

## 🎯 설계 목표

### 확장성 요구사항
현재 3개 업체 타입:
- 스튜디오
- 메이크업
- 예복/드레스

향후 확장 가능성:
- 예식장
- 교통편 (리무진, 웨딩카)
- 청첩장 제작
- 웨딩 플래너
- 웨딩 영상 촬영
- 한복/예단
- 부케/플라워
- 예물/반지
- 허니문 여행사

### 설계 원칙
1. **타입 확장성**: 새 업체 타입 추가 시 스키마 변경 최소화
2. **속성 유연성**: 업체별 고유 속성 저장 가능 (JSON)
3. **검색 효율성**: 자주 조회되는 필드는 인덱싱
4. **데이터 정합성**: FK 관계로 참조 무결성 보장

---

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │
│ email           │
│ name            │
│ phone           │
│ role            │ ← CUSTOMER | VENDOR | ADMIN
│ createdAt       │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────────┐
│      SimulationResult   │
│─────────────────────────│
│ id (PK)                 │
│ userId (FK)             │
│ groomImageUrl           │
│ brideImageUrl           │
│ outputImageUrl          │
│ status                  │
│ concept                 │
│ metadata (JSON)         │ ← 처리 시간, AI 파라미터 등
│ createdAt               │
│ completedAt             │
└─────────────────────────┘


┌──────────────────────┐
│   VendorCategory     │ ← 업체 카테고리 (확장 가능)
│──────────────────────│
│ id (PK)              │
│ slug                 │ ← studio, makeup, dress, venue...
│ name                 │ ← "스튜디오", "메이크업"
│ description          │
│ icon                 │ ← 아이콘 URL 또는 emoji
│ displayOrder         │ ← 표시 순서
│ isActive             │
│ schemaVersion        │ ← 메타데이터 스키마 버전
│ requiredFields (JSON)│ ← 필수 입력 필드 정의
│ createdAt            │
└──────────────────────┘
        │
        │ 1:N
        ▼
┌──────────────────────────┐
│        Vendor            │
│──────────────────────────│
│ id (PK)                  │
│ categoryId (FK)          │
│ ownerId (FK → User)      │ ← 업체 소유자
│ name                     │
│ slug                     │ ← URL용 (unique)
│ description              │
│ location                 │ ← 주소
│ lat, lng                 │ ← 지도 좌표
│ phone                    │
│ email                    │
│ website                  │
│ priceRange               │ ← "100-200만원" (텍스트)
│ priceMin, priceMax       │ ← 숫자 (필터링용)
│ businessHours (JSON)     │ ← 영업시간
│ metadata (JSON)          │ ← 업체별 고유 속성
│ rating                   │ ← 평균 평점
│ reviewCount              │
│ bookingCount             │ ← 예약 수
│ isVerified               │ ← 인증 여부
│ isActive                 │
│ createdAt                │
│ updatedAt                │
└──────────────────────────┘
        │
        │ 1:N
        ├──────────────────────────────────┐
        │                                  │
        ▼                                  ▼
┌─────────────────┐              ┌─────────────────┐
│  VendorImage    │              │  VendorTag      │
│─────────────────│              │─────────────────│
│ id (PK)         │              │ id (PK)         │
│ vendorId (FK)   │              │ vendorId (FK)   │
│ url             │              │ tagId (FK)      │
│ type            │ ← PORTFOLIO  │ createdAt       │
│                 │    THUMBNAIL │                 │
│                 │    LOGO      │                 │
│ displayOrder    │              │                 │
│ altText         │              │                 │
│ createdAt       │              │                 │
└─────────────────┘              └─────────────────┘
                                         │
                                         │ N:1
                                         ▼
                                 ┌─────────────────┐
                                 │       Tag       │
                                 │─────────────────│
                                 │ id (PK)         │
                                 │ name            │ ← "야외촬영"
                                 │ slug            │ ← "outdoor"
                                 │ categoryId (FK) │ ← 선택적
                                 │ usageCount      │
                                 └─────────────────┘


┌──────────────────────────┐
│        Review            │
│──────────────────────────│
│ id (PK)                  │
│ vendorId (FK)            │
│ userId (FK)              │
│ bookingId (FK)           │ ← 선택적
│ rating                   │ ← 1-5
│ title                    │
│ content                  │
│ images (JSON)            │ ← 리뷰 이미지 URLs
│ isVerified               │ ← 실제 이용 확인
│ response                 │ ← 업체 답변
│ respondedAt              │
│ createdAt                │
└──────────────────────────┘


┌──────────────────────────┐
│        Booking           │ ← 예약/문의
│──────────────────────────│
│ id (PK)                  │
│ vendorId (FK)            │
│ userId (FK)              │
│ status                   │ ← PENDING, CONFIRMED,
│                          │    COMPLETED, CANCELLED
│ eventDate                │ ← 결혼식 날짜
│ guestCount               │ ← 하객 수 (예식장용)
│ budget                   │ ← 예산
│ message                  │ ← 문의 내용
│ vendorResponse           │
│ metadata (JSON)          │ ← 업체별 추가 정보
│ createdAt                │
│ confirmedAt              │
│ completedAt              │
└──────────────────────────┘


┌──────────────────────────┐
│      Favorite            │ ← 찜하기
│──────────────────────────│
│ id (PK)                  │
│ userId (FK)              │
│ vendorId (FK)            │
│ createdAt                │
│ @@unique([userId, vendorId])
└──────────────────────────┘
```

---

## 🔧 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// User & Auth
// ============================================

enum UserRole {
  CUSTOMER  // 일반 사용자
  VENDOR    // 업체 관리자
  ADMIN     // 시스템 관리자
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  password      String?   // 해싱된 비밀번호 (OAuth 시 null)
  role          UserRole  @default(CUSTOMER)

  // OAuth
  provider      String?   // google, kakao, naver
  providerId    String?

  emailVerified Boolean   @default(false)
  isActive      Boolean   @default(true)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Relations
  simulationResults SimulationResult[]
  ownedVendors      Vendor[]           @relation("VendorOwner")
  reviews           Review[]
  bookings          Booking[]
  favorites         Favorite[]

  @@index([email])
  @@index([provider, providerId])
}

// ============================================
// Simulation (AI 결혼 사진)
// ============================================

enum SimulationStatus {
  PENDING     // 대기
  UPLOADING   // 업로드 중
  PROCESSING  // AI 처리 중
  COMPLETED   // 완료
  FAILED      // 실패
}

model SimulationResult {
  id              String            @id @default(cuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 입력 이미지
  groomImageUrl   String
  brideImageUrl   String

  // 출력 이미지
  outputImageUrl  String?

  // 처리 상태
  status          SimulationStatus  @default(PENDING)
  concept         String?           // "classic", "modern", "outdoor", "vintage"

  // 메타데이터 (처리 시간, AI 모델 버전 등)
  metadata        Json?             // { processingTime: 45000, modelVersion: "v2.1", ... }

  // 에러 정보
  errorMessage    String?

  createdAt       DateTime          @default(now())
  completedAt     DateTime?

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

// ============================================
// Vendor Categories (확장 가능)
// ============================================

model VendorCategory {
  id              String    @id @default(cuid())
  slug            String    @unique       // "studio", "makeup", "dress", "venue", "car"
  name            String                  // "스튜디오", "메이크업"
  description     String?
  icon            String?                 // 아이콘 URL 또는 emoji

  displayOrder    Int       @default(0)   // 표시 순서
  isActive        Boolean   @default(true)

  // 메타데이터 스키마 정의 (JSON Schema)
  schemaVersion   String    @default("1.0")
  requiredFields  Json?     // { "portfolio": true, "certifications": false, ... }

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  vendors         Vendor[]
  tags            Tag[]

  @@index([slug])
  @@index([isActive, displayOrder])
}

// ============================================
// Vendors (업체)
// ============================================

model Vendor {
  id              String          @id @default(cuid())

  // 카테고리
  categoryId      String
  category        VendorCategory  @relation(fields: [categoryId], references: [id])

  // 소유자
  ownerId         String?
  owner           User?           @relation("VendorOwner", fields: [ownerId], references: [id])

  // 기본 정보
  name            String
  slug            String          @unique       // URL용 (unique)
  description     String?         @db.Text

  // 연락처
  phone           String?
  email           String?
  website         String?

  // 위치
  location        String                        // "서울특별시 강남구 테헤란로 123"
  lat             Float?                        // 위도
  lng             Float?                        // 경도

  // 가격
  priceRange      String?                       // "100만원~200만원" (표시용)
  priceMin        Int?                          // 100 (필터링용, 단위: 만원)
  priceMax        Int?                          // 200

  // 영업 정보
  businessHours   Json?           // { "mon": "09:00-18:00", "tue": "09:00-18:00", ... }

  // 업체별 고유 속성 (확장 가능)
  metadata        Json?           // 예시:
                                  // 스튜디오: { "studioSize": "200평", "equipments": ["4K카메라", ...] }
                                  // 메이크업: { "certifications": ["국가자격증"], "specialties": ["한복"] }
                                  // 예식장: { "capacity": 300, "parkingSpots": 100, "hasChapel": true }

  // 통계
  rating          Float?          @default(0)   // 평균 평점 (1-5)
  reviewCount     Int             @default(0)
  bookingCount    Int             @default(0)
  favoriteCount   Int             @default(0)
  viewCount       Int             @default(0)

  // 상태
  isVerified      Boolean         @default(false)  // 인증 업체
  isActive        Boolean         @default(true)
  isPremium       Boolean         @default(false)  // 프리미엄 업체 (광고)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relations
  images          VendorImage[]
  tags            VendorTag[]
  reviews         Review[]
  bookings        Booking[]
  favorites       Favorite[]

  @@index([categoryId])
  @@index([slug])
  @@index([isActive, isPremium])
  @@index([rating])
  @@index([location]) // 지역 검색용
  @@index([priceMin, priceMax])
}

// ============================================
// Vendor Images
// ============================================

enum VendorImageType {
  PORTFOLIO   // 포트폴리오
  THUMBNAIL   // 썸네일
  LOGO        // 로고
  INTERIOR    // 인테리어
  MENU        // 메뉴/가격표
}

model VendorImage {
  id            String           @id @default(cuid())
  vendorId      String
  vendor        Vendor           @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  url           String
  type          VendorImageType  @default(PORTFOLIO)
  displayOrder  Int              @default(0)
  altText       String?

  createdAt     DateTime         @default(now())

  @@index([vendorId, type])
  @@index([vendorId, displayOrder])
}

// ============================================
// Tags (검색 및 필터링)
// ============================================

model Tag {
  id            String          @id @default(cuid())
  name          String                              // "야외촬영", "한복", "채플"
  slug          String          @unique             // "outdoor", "hanbok", "chapel"

  categoryId    String?                             // 특정 카테고리에 속한 태그
  category      VendorCategory? @relation(fields: [categoryId], references: [id])

  usageCount    Int             @default(0)         // 사용된 횟수

  createdAt     DateTime        @default(now())

  // Relations
  vendors       VendorTag[]

  @@index([slug])
  @@index([categoryId])
}

model VendorTag {
  id        String   @id @default(cuid())
  vendorId  String
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  tagId     String
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([vendorId, tagId])
  @@index([vendorId])
  @@index([tagId])
}

// ============================================
// Reviews
// ============================================

model Review {
  id            String    @id @default(cuid())
  vendorId      String
  vendor        Vendor    @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  bookingId     String?
  booking       Booking?  @relation(fields: [bookingId], references: [id])

  rating        Int                 // 1-5
  title         String?
  content       String    @db.Text
  images        Json?               // ["url1", "url2", ...]

  isVerified    Boolean   @default(false)  // 실제 이용 확인

  // 업체 답변
  response      String?   @db.Text
  respondedAt   DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([vendorId])
  @@index([userId])
  @@index([rating])
  @@index([createdAt])
}

// ============================================
// Bookings (예약/문의)
// ============================================

enum BookingStatus {
  PENDING     // 문의 접수
  CONFIRMED   // 예약 확정
  COMPLETED   // 이용 완료
  CANCELLED   // 취소
  REJECTED    // 거절
}

model Booking {
  id              String        @id @default(cuid())
  vendorId        String
  vendor          Vendor        @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  status          BookingStatus @default(PENDING)

  // 결혼식 정보
  eventDate       DateTime?               // 결혼식 날짜
  guestCount      Int?                    // 하객 수 (예식장용)
  budget          Int?                    // 예산 (만원)

  // 문의 내용
  message         String        @db.Text
  vendorResponse  String?       @db.Text

  // 업체별 추가 정보 (확장 가능)
  metadata        Json?         // 예시:
                                // 스튜디오: { "shootingDate": "2025-05-01", "location": "야외" }
                                // 예식장: { "meal": "한식", "ceremony": "양식" }

  createdAt       DateTime      @default(now())
  confirmedAt     DateTime?
  completedAt     DateTime?

  // Relations
  reviews         Review[]

  @@index([vendorId])
  @@index([userId])
  @@index([status])
  @@index([eventDate])
}

// ============================================
// Favorites (찜하기)
// ============================================

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  vendorId  String
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, vendorId])
  @@index([userId])
  @@index([vendorId])
}
```

---

## 🎨 업체별 Metadata 예시

### 스튜디오
```json
{
  "studioSize": "200평",
  "equipments": ["4K 시네마카메라", "드론", "지미집"],
  "concepts": ["클래식", "모던", "야외", "빈티지"],
  "includedPhotos": 100,
  "albumOptions": ["30P", "50P", "70P"],
  "retouchingIncluded": true,
  "shootingDuration": "4시간",
  "additionalLocations": ["한옥마을", "해변", "궁궐"]
}
```

### 메이크업
```json
{
  "certifications": ["국가자격증", "피부관리사"],
  "specialties": ["한복 메이크업", "웨딩 메이크업", "남성 메이크업"],
  "brands": ["MAC", "Bobbi Brown", "NARS"],
  "services": ["본식", "피로연", "리허설"],
  "travelAvailable": true,
  "travelFee": "지역별 상이"
}
```

### 예복/드레스
```json
{
  "dressCount": 500,
  "suitCount": 200,
  "designers": ["Vera Wang", "Pronovias", "국내 디자이너"],
  "sizeRange": ["44-110"],
  "rentalDays": 2,
  "fittingIncluded": 3,
  "alterationIncluded": true,
  "accessories": ["베일", "장갑", "티아라"]
}
```

### 예식장
```json
{
  "capacity": 300,
  "hallCount": 2,
  "parkingSpots": 100,
  "valetParking": true,
  "hasChapel": true,
  "hasOutdoorGarden": true,
  "mealTypes": ["한식", "양식", "뷔페"],
  "facilities": ["신랑신부 대기실", "화장실", "수유실"],
  "packages": [
    {
      "name": "기본형",
      "price": 5000,
      "includes": ["홀 대여", "식사", "기본 장식"]
    },
    {
      "name": "프리미엄",
      "price": 8000,
      "includes": ["홀 대여", "식사", "프리미엄 장식", "웨딩카"]
    }
  ]
}
```

### 웨딩카/교통편
```json
{
  "vehicles": [
    {
      "type": "리무진",
      "model": "벤츠 S클래스",
      "color": "블랙",
      "capacity": 4
    },
    {
      "type": "클래식카",
      "model": "롤스로이스",
      "color": "화이트",
      "capacity": 2
    }
  ],
  "includedServices": ["드라이버", "장식", "샴페인"],
  "serviceHours": 3,
  "availableRoutes": ["자택 → 예식장", "예식장 → 피로연장", "전체 패키지"]
}
```

### 청첩장
```json
{
  "types": ["인쇄", "디지털", "모바일"],
  "printOptions": ["엠보싱", "박", "UV코팅"],
  "designs": ["클래식", "모던", "미니멀", "플로럴"],
  "customDesignAvailable": true,
  "minimumOrder": 100,
  "productionDays": 7,
  "includedEnvelopes": true,
  "digitalFeatures": ["지도", "갤러리", "방명록", "계좌번호"]
}
```

---

## 🔍 주요 쿼리 패턴

### 1. 업체 검색 (카테고리 + 지역 + 가격)
```typescript
const vendors = await prisma.vendor.findMany({
  where: {
    categoryId: categoryId,
    location: { contains: "강남" },
    priceMin: { gte: 100 },
    priceMax: { lte: 300 },
    isActive: true,
  },
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
    { isPremium: 'desc' },
    { rating: 'desc' },
  ],
});
```

### 2. 태그 기반 필터링
```typescript
const vendors = await prisma.vendor.findMany({
  where: {
    tags: {
      some: {
        tag: {
          slug: { in: ['outdoor', 'classic'] },
        },
      },
    },
  },
});
```

### 3. 업체 상세 + 리뷰
```typescript
const vendor = await prisma.vendor.findUnique({
  where: { slug: 'studio-abc' },
  include: {
    category: true,
    images: true,
    tags: {
      include: { tag: true },
    },
    reviews: {
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    _count: {
      select: {
        reviews: true,
        bookings: true,
      },
    },
  },
});
```

### 4. 새 카테고리 추가 (확장성)
```typescript
// 예식장 카테고리 추가
const venueCategory = await prisma.vendorCategory.create({
  data: {
    slug: 'venue',
    name: '예식장',
    description: '웨딩홀, 호텔, 야외 예식장',
    icon: '🏛️',
    displayOrder: 4,
    requiredFields: {
      capacity: true,
      parkingSpots: true,
      mealTypes: true,
    },
  },
});

// 예식장 업체 등록
const venue = await prisma.vendor.create({
  data: {
    categoryId: venueCategory.id,
    name: '그랜드 하얏트 웨딩홀',
    slug: 'grand-hyatt-wedding',
    location: '서울특별시 용산구',
    priceMin: 500,
    priceMax: 1000,
    metadata: {
      capacity: 300,
      hallCount: 2,
      parkingSpots: 150,
      hasChapel: true,
      mealTypes: ['한식', '양식', '뷔페'],
    },
  },
});
```

---

## 📈 인덱스 전략

### 성능 최적화 인덱스
```prisma
// 자주 사용되는 복합 인덱스
@@index([categoryId, isActive, isPremium])
@@index([categoryId, priceMin, priceMax])
@@index([location, rating])

// 검색용
@@index([name, location]) // Full-text search 대안
```

### 필요 시 추가 고려
- **Full-text Search**: PostgreSQL `tsvector` 또는 Elasticsearch 연동
- **Geospatial Index**: PostGIS 확장으로 지리 기반 검색
- **Partial Index**: `WHERE isActive = true` 조건부 인덱스

---

## 🔄 마이그레이션 전략

### 새 카테고리 추가 시
1. `VendorCategory` 테이블에 레코드 추가만 하면 됨
2. 스키마 변경 불필요
3. `metadata` JSON 필드에 새 속성 자유롭게 추가

### 공통 속성 발견 시
- JSON에서 자주 사용되는 필드를 컬럼으로 승격
- 예: `capacity`가 여러 카테고리에서 사용되면 `Vendor.capacity Int?` 추가

---

## ✅ 확장성 검증

### ✓ 새 업체 타입 추가
- `VendorCategory` 레코드만 추가
- 스키마 변경 없음

### ✓ 업체별 고유 속성
- `metadata` JSON 필드로 자유롭게 저장
- TypeScript 타입으로 타입 안전성 확보 가능

### ✓ 검색 및 필터링
- 태그 시스템으로 유연한 분류
- 카테고리별 필터 동적 생성 가능

### ✓ 성능
- 자주 조회되는 필드는 인덱싱
- JSON 필드는 필요 시 GIN 인덱스 추가 가능

---

## 🔗 관련 문서
- [001_initial_plan.md](../plan/001_initial_plan.md)
- [002_setup_todo.md](../todo/002_setup_todo.md)

---

## 📝 다음 단계
1. Prisma 스키마 파일 생성
2. 초기 마이그레이션 실행
3. Seed 데이터 작성 (샘플 카테고리 및 업체)
