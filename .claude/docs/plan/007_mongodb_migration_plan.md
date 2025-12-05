# 007: PostgreSQL → MongoDB 마이그레이션 계획

## 📋 개요
- **작성일**: 2025-12-05
- **상태**: 계획 중
- **목적**: 데이터베이스를 PostgreSQL에서 MongoDB로 전환

## 🎯 변경 사유
사용자가 MongoDB 사용을 요청함

## 📊 현재 상태
- PostgreSQL 16-alpine 사용 중
- Prisma ORM으로 스키마 관리
- 더미 데이터 254개 레코드 존재
- 마이그레이션 파일: `20251205015830_init`

## 🔄 마이그레이션 전략

### Option 1: 완전 전환 (권장 ⭐)
**장점**:
- MongoDB의 유연한 스키마 활용
- JSON 필드가 많은 현재 설계와 잘 맞음 (metadata, businessHours 등)
- 수평 확장 용이

**단점**:
- 관계형 데이터 모델링 재설계 필요
- 트랜잭션 처리 복잡도 증가
- Prisma의 MongoDB 지원이 PostgreSQL보다 제한적

**작업**:
1. Docker Compose에 MongoDB 추가
2. Prisma schema를 MongoDB provider로 변경
3. 관계 및 인덱스 재설계
4. 더미 데이터 마이그레이션
5. 백엔드 서비스 테스트

### Option 2: 하이브리드 (비추천)
PostgreSQL과 MongoDB를 동시에 사용
- PostgreSQL: 트랜잭션이 중요한 데이터 (User, Booking, Payment)
- MongoDB: 유연한 스키마가 필요한 데이터 (Vendor metadata, SimulationResult)

**단점**:
- 복잡도 증가
- 데이터 일관성 관리 어려움
- 인프라 비용 증가

### Option 3: 점진적 마이그레이션 (비추천)
일부 테이블만 먼저 MongoDB로 이동

**단점**:
- 마이그레이션 기간 동안 복잡도 증가
- 초기 단계 프로젝트에 부적합

## ✅ 선택된 옵션: Option 1 (완전 전환)

## 📝 상세 실행 계획

### 1단계: MongoDB 환경 설정
```yaml
# docker-compose.yml에 추가
mongodb:
  image: mongo:7
  container_name: sdm-mongodb
  ports:
    - '27017:27017'
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: admin123
    MONGO_INITDB_DATABASE: sdm
  volumes:
    - mongodb_data:/data/db
```

### 2단계: Prisma Schema 변경
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// MongoDB에서는 @id @default(auto()) @map("_id") @db.ObjectId 사용
// 관계는 @relation 대신 embedded documents 또는 manual references 사용
```

### 3단계: 스키마 재설계 고려사항
- `@id` 필드: String → ObjectId 타입
- 인덱스: `@@index` 유지 (MongoDB도 지원)
- Enum: MongoDB는 직접 지원 안 함 → String with validation
- 관계: 일부는 embedded documents로 변경 검토
  - VendorImage → Vendor 내부 배열로?
  - VendorTag → 태그 배열로?

### 4단계: 데이터 마이그레이션
**기존 데이터가 있는 경우**:
1. PostgreSQL 데이터 export (JSON)
2. 스키마 변환 스크립트 작성
3. MongoDB import

**현재 더미 데이터**:
- 새로운 seed 스크립트 작성 (MongoDB용)

### 5단계: 백엔드 코드 검증
- Prisma Client 재생성
- 쿼리 동작 확인 (특히 관계 조인)
- API 엔드포인트 테스트

## ⚠️ 주의사항

### Prisma MongoDB 제한사항
1. **Many-to-many 관계**: 중간 테이블 불가 → 수동 참조 필요
2. **트랜잭션**: $transaction 제한적 지원
3. **Aggregate 함수**: 일부 제한
4. **Cascading Delete**: 명시적으로 처리 필요

### 영향 받는 모델
- **VendorTag**: many-to-many → 태그 ID 배열로 변경 고려
- **Favorite**: many-to-many → 사용자 ID 배열 or 별도 컬렉션
- **관계 조인**: `include` 동작 변경 가능성

## 📊 성능 고려사항

### MongoDB 장점 (현재 프로젝트)
✅ Vendor의 metadata (JSON) - 완벽한 fit
✅ SimulationResult의 metadata - 완벽한 fit
✅ 이미지 배열, 태그 배열 - embedded documents
✅ 수평 확장 (향후 대규모 데이터)

### PostgreSQL 장점 (잃게 되는 것)
❌ ACID 트랜잭션 (결제, 예약 시스템)
❌ 복잡한 JOIN 쿼리
❌ 외래 키 제약조건
❌ Prisma의 완전한 기능 지원

## 🎯 마이그레이션 체크리스트

### 환경 설정
- [ ] docker-compose.yml MongoDB 추가
- [ ] .env 파일 DATABASE_URL 변경
- [ ] MongoDB 컨테이너 실행 확인

### 스키마 변경
- [ ] Prisma schema provider 변경
- [ ] ID 필드 ObjectId로 변경
- [ ] Enum을 String으로 변경
- [ ] Many-to-many 관계 재설계
- [ ] 인덱스 재확인

### 데이터
- [ ] 기존 PostgreSQL 데이터 백업
- [ ] MongoDB seed 스크립트 작성
- [ ] 더미 데이터 삽입

### 코드
- [ ] Prisma Client 재생성
- [ ] 백엔드 서비스 동작 확인
- [ ] API 엔드포인트 테스트
- [ ] 프론트엔드 연동 테스트

### 문서
- [ ] current.md 업데이트
- [ ] index.md 업데이트
- [ ] DKB에 MongoDB 가이드 추가

## 📚 참고 문서
- [Prisma MongoDB 공식 문서](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- [003_database_schema.md](../structure/003_database_schema.md) - 기존 스키마
- [006_prisma_basics.md](../DKB/006_prisma_basics.md) - Prisma 기본

## 💡 추천 사항

현재 프로젝트는 **개발 초기 단계**이고 더미 데이터만 있으므로 마이그레이션이 적절한 시점입니다.

**하지만 고려할 점**:
1. Prisma + MongoDB는 PostgreSQL보다 제한적
2. 결제/예약 시스템에서 트랜잭션 필요 시 복잡도 증가
3. Many-to-many 관계 재설계 필요

**대안 제안**:
- MongoDB를 선택한 특별한 이유가 있는지 확인
- 현재 설계는 PostgreSQL + JSON 필드로도 충분히 유연함
- 향후 NoSQL이 정말 필요한 부분만 분리하는 것도 고려

사용자 확인 후 진행하겠습니다.
