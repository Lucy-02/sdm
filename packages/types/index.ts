// Common types shared between frontend and backend

// ============================================
// Base Types & Utility Types
// ============================================

/**
 * 모든 엔티티의 기본 타임스탬프 필드
 * - 이유: createdAt, updatedAt을 일괄 적용하여 일관성 확보
 * - 사용법: interface Entity extends Timestamps { ... }
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ID가 포함된 기본 엔티티 타입
 * - 이유: 모든 DB 엔티티가 공통으로 가지는 id + timestamps 조합
 * - 사용법: interface Entity extends BaseEntity { ... }
 */
export interface BaseEntity extends Timestamps {
  id: string;
}

/**
 * 활성화 상태를 가지는 엔티티
 * - 이유: 소프트 삭제(soft delete) 패턴 지원
 * - 사용법: interface Entity extends ActiveEntity { ... }
 */
export interface ActiveEntity extends BaseEntity {
  isActive: boolean;
}

/**
 * Nullable 타입 유틸리티
 * - 이유: optional과 null을 명시적으로 구분
 */
export type Nullable<T> = T | null;

/**
 * 특정 필드를 optional로 변환
 * - 이유: Update DTO 등에서 활용
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 특정 필드를 required로 변환
 * - 이유: Create DTO에서 필수 필드 강제
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Entity에서 ID와 Timestamps 제외 (Create DTO용)
 * - 이유: 생성 시에는 id, createdAt, updatedAt이 자동 생성됨
 */
export type CreateInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Entity에서 ID와 Timestamps를 optional로 (Update DTO용)
 * - 이유: 수정 시에는 변경할 필드만 전송
 */
export type UpdateInput<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// ============================================
// User & Auth
// ============================================

/**
 * 사용자 역할 enum
 * - 이유: 역할 기반 접근 제어(RBAC)를 위한 상수화
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

/**
 * 사용자 엔티티
 * - ActiveEntity 상속: isActive로 계정 비활성화 지원
 * - 이유: 탈퇴/정지 처리를 soft delete로 구현
 */
export interface User extends ActiveEntity {
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  lastLoginAt?: Date;
}

/**
 * 사용자 생성 DTO
 * - 이유: 회원가입 시 필요한 필드만 정의
 */
export type CreateUserInput = CreateInput<User> & {
  password: string; // 생성 시에만 필요
};

/**
 * 사용자 수정 DTO
 * - 이유: 프로필 수정 시 변경 가능한 필드만 정의
 */
export type UpdateUserInput = Pick<User, 'name' | 'phone'> & Partial<Pick<User, 'email'>>;

// ============================================
// Simulation
// ============================================

/**
 * 시뮬레이션 상태 enum
 * - 이유: 상태 머신 패턴으로 시뮬레이션 진행 상태 추적
 * - 상태 흐름: PENDING → UPLOADING → PROCESSING → COMPLETED/FAILED
 */
export enum SimulationStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * 시뮬레이션 결과 엔티티
 * - BaseEntity만 상속: isActive 불필요 (결과는 삭제만 가능)
 * - 이유: 시뮬레이션 결과는 활성/비활성 개념이 없음
 */
export interface SimulationResult extends BaseEntity {
  userId: string;
  groomImageUrl: string;
  brideImageUrl: string;
  outputImageUrl?: string;
  status: SimulationStatus;
  concept?: string;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  completedAt?: Date;
}

/**
 * 시뮬레이션 생성 DTO
 * - 이유: 클라이언트에서 시뮬레이션 요청 시 필요한 필드
 * - 주의: File 타입은 브라우저 전용이므로 공유 타입에서는 string(URL/path)만 사용
 */
export type CreateSimulationInput = Pick<SimulationResult, 'userId' | 'concept'> & {
  groomImage: string; // URL 또는 파일 경로
  brideImage: string; // URL 또는 파일 경로
};

// ============================================
// Vendor
// ============================================

/**
 * 업체 카테고리 엔티티
 * - ActiveEntity 상속: 카테고리 비활성화 지원
 * - 이유: 카테고리 삭제 대신 비활성화로 연관 데이터 보존
 */
export interface VendorCategory extends ActiveEntity {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

/**
 * 업체 통계 정보 (분리된 인터페이스)
 * - 이유: 통계 관련 필드를 그룹화하여 재사용성 향상
 * - 확장: 다른 엔티티의 통계에도 적용 가능
 */
export interface VendorStats {
  rating?: number;
  reviewCount: number;
  bookingCount: number;
  favoriteCount: number;
  viewCount: number;
}

/**
 * 업체 위치 정보 (분리된 인터페이스)
 * - 이유: 지도 관련 기능에서 재사용
 * - 확장: 다른 위치 기반 엔티티에도 적용 가능
 */
export interface GeoLocation {
  location: string;
  lat?: number;
  lng?: number;
}

/**
 * 업체 가격 정보 (분리된 인터페이스)
 * - 이유: 가격 필터링, 정렬 등에서 재사용
 * - 확장: Price Package 구현 시 활용
 */
export interface PriceInfo {
  priceRange?: string;
  priceMin?: number;
  priceMax?: number;
}

/**
 * 업체 상태 플래그 (분리된 인터페이스)
 * - 이유: 업체 상태 관련 필드를 그룹화
 */
export interface VendorFlags {
  isVerified: boolean;
  isActive: boolean;
  isPremium: boolean;
}

/**
 * 업체 엔티티
 * - BaseEntity + 조합 인터페이스 사용
 * - 이유: 관심사 분리로 각 기능별 타입 재사용 가능
 */
export interface Vendor extends BaseEntity, GeoLocation, PriceInfo, VendorStats, VendorFlags {
  categoryId: string;
  category?: VendorCategory;
  ownerId?: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessHours?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

/**
 * 업체 이미지 타입 enum
 * - 이유: 이미지 용도별 분류로 조회/표시 최적화
 */
export enum VendorImageType {
  PORTFOLIO = 'PORTFOLIO',
  THUMBNAIL = 'THUMBNAIL',
  LOGO = 'LOGO',
  INTERIOR = 'INTERIOR',
  MENU = 'MENU',
}

/**
 * 업체 이미지 엔티티
 * - Timestamps만 상속: updatedAt 불필요하지만 일관성 유지
 * - 이유: 이미지는 수정보다 삭제 후 재등록이 일반적
 */
export interface VendorImage extends Timestamps {
  id: string;
  vendorId: string;
  url: string;
  type: VendorImageType;
  displayOrder: number;
  altText?: string;
}

/**
 * 태그 엔티티
 * - createdAt만 필요하지만 Timestamps 상속으로 일관성 유지
 * - 이유: 태그는 생성 후 수정이 드물지만 구조 통일
 */
export interface Tag extends Timestamps {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  usageCount: number;
}

/**
 * 업체 생성 DTO
 * - 이유: 업체 등록 시 필요한 필드만 정의 (통계는 제외)
 */
export type CreateVendorInput = Omit<
  CreateInput<Vendor>,
  keyof VendorStats | keyof VendorFlags
> & {
  isActive?: boolean; // 기본값 true
};

/**
 * 업체 수정 DTO
 * - 이유: 업체 정보 수정 시 변경 가능한 필드만 정의
 */
export type UpdateVendorInput = UpdateInput<Vendor>;

// ============================================
// Review
// ============================================

/**
 * 리뷰 엔티티
 * - BaseEntity 상속: id + timestamps
 * - 이유: 리뷰는 수정 이력 추적이 중요함 (updatedAt 활용)
 */
export interface Review extends BaseEntity {
  vendorId: string;
  userId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  response?: string;
  respondedAt?: Date;
}

/**
 * 리뷰 생성 DTO
 * - 이유: 리뷰 작성 시 필요한 필드만 정의
 */
export type CreateReviewInput = Pick<Review, 'vendorId' | 'userId' | 'rating' | 'content'> &
  Partial<Pick<Review, 'bookingId' | 'title' | 'images'>>;

/**
 * 리뷰 수정 DTO
 * - 이유: 리뷰 수정 시 변경 가능한 필드만 정의
 */
export type UpdateReviewInput = Partial<Pick<Review, 'rating' | 'title' | 'content' | 'images'>>;

/**
 * 업체 답변 DTO
 * - 이유: 업체가 리뷰에 답변할 때 사용
 */
export type VendorReplyInput = Pick<Review, 'response'>;

// ============================================
// Booking
// ============================================

/**
 * 예약 상태 enum
 * - 이유: 상태 머신 패턴으로 예약 흐름 관리
 * - 상태 흐름: PENDING → CONFIRMED/REJECTED → COMPLETED/CANCELLED
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

/**
 * 예약 엔티티
 * - BaseEntity 상속: 예약은 수정 이력 추적 중요
 * - 이유: 예약 변경 내역을 updatedAt으로 추적
 */
export interface Booking extends BaseEntity {
  vendorId: string;
  userId: string;
  status: BookingStatus;
  eventDate?: Date;
  guestCount?: number;
  budget?: number;
  message: string;
  vendorResponse?: string;
  metadata?: Record<string, unknown>;
  confirmedAt?: Date;
  completedAt?: Date;
}

/**
 * 예약 생성 DTO
 * - 이유: 예약 요청 시 필요한 필드만 정의
 */
export type CreateBookingInput = Pick<Booking, 'vendorId' | 'userId' | 'message'> &
  Partial<Pick<Booking, 'eventDate' | 'guestCount' | 'budget' | 'metadata'>>;

/**
 * 예약 상태 변경 DTO
 * - 이유: 업체가 예약 상태를 변경할 때 사용
 */
export type UpdateBookingStatusInput = Pick<Booking, 'status'> &
  Partial<Pick<Booking, 'vendorResponse'>>;

// ============================================
// API DTOs
// ============================================

/**
 * 페이지네이션 파라미터
 * - 이유: 목록 조회 API에서 공통으로 사용
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 정렬 파라미터 (제네릭)
 * - 이유: 다양한 엔티티에서 타입 안전한 정렬 지원
 * - 사용법: SortParams<'rating' | 'price' | 'createdAt'>
 */
export interface SortParams<T extends string = string> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 필터 파라미터 (제네릭)
 * - 이유: 검색/필터 조건을 타입 안전하게 정의
 */
export interface FilterParams<T = Record<string, unknown>> {
  filters?: Partial<T>;
}

/**
 * 목록 조회 파라미터 (조합)
 * - 이유: 페이지네이션 + 정렬 + 필터를 한번에 적용
 */
export interface ListParams<T = Record<string, unknown>, S extends string = string>
  extends PaginationParams,
    SortParams<S>,
    FilterParams<T> {}

/**
 * 페이지네이션된 응답 메타데이터
 * - 이유: 페이지 정보를 별도 타입으로 분리하여 재사용
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 페이지네이션된 응답 (제네릭)
 * - 이유: 모든 목록 API에서 일관된 응답 구조 사용
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * 단일 항목 응답 (제네릭)
 * - 이유: 상세 조회 API에서 일관된 응답 구조 사용
 */
export interface SingleResponse<T> {
  data: T;
}

/**
 * API 에러 응답
 * - 이유: 에러 응답 구조 표준화
 */
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string; // 에러 코드 (예: 'USER_NOT_FOUND')
  errors?: Record<string, string[]>;
  timestamp?: string;
}

/**
 * API 성공 응답 (데이터 없음)
 * - 이유: 삭제 등 데이터 반환이 불필요한 경우
 */
export interface ApiSuccess {
  success: boolean;
  message?: string;
}

// ============================================
// WebSocket Events
// ============================================

/**
 * WebSocket 이벤트 enum
 * - 이유: 이벤트명 상수화로 타이핑 실수 방지
 */
export enum WebSocketEvent {
  // Simulation events
  SIMULATION_STARTED = 'simulation:started',
  SIMULATION_PROGRESS = 'simulation:progress',
  SIMULATION_COMPLETED = 'simulation:completed',
  SIMULATION_FAILED = 'simulation:failed',
  // Connection events (확장성을 위해 추가)
  CONNECTION_ESTABLISHED = 'connection:established',
  CONNECTION_ERROR = 'connection:error',
}

/**
 * WebSocket 기본 페이로드
 * - 이유: 모든 WS 이벤트가 공통으로 가지는 필드
 */
export interface BaseSocketPayload {
  resultId: string;
  timestamp?: Date;
}

/**
 * 시뮬레이션 진행 상태 페이로드
 * - BaseSocketPayload 상속으로 일관성 확보
 */
export interface SimulationProgressPayload extends BaseSocketPayload {
  progress: number; // 0-100
  status: SimulationStatus;
  message?: string;
}

/**
 * 시뮬레이션 완료 페이로드
 */
export interface SimulationCompletedPayload extends BaseSocketPayload {
  outputImageUrl: string;
}

/**
 * 시뮬레이션 실패 페이로드
 */
export interface SimulationFailedPayload extends BaseSocketPayload {
  errorMessage: string;
  errorCode?: string;
}

/**
 * WebSocket 이벤트-페이로드 매핑 (타입 안전성)
 * - 이유: 이벤트별 페이로드 타입을 강제하여 런타임 오류 방지
 */
export interface WebSocketEventPayloadMap {
  [WebSocketEvent.SIMULATION_STARTED]: BaseSocketPayload;
  [WebSocketEvent.SIMULATION_PROGRESS]: SimulationProgressPayload;
  [WebSocketEvent.SIMULATION_COMPLETED]: SimulationCompletedPayload;
  [WebSocketEvent.SIMULATION_FAILED]: SimulationFailedPayload;
}

// ============================================
// Type Guards (런타임 타입 체크)
// ============================================

/**
 * SimulationStatus 타입 가드
 * - 이유: 런타임에서 문자열이 유효한 SimulationStatus인지 확인
 */
export function isSimulationStatus(value: string): value is SimulationStatus {
  return Object.values(SimulationStatus).includes(value as SimulationStatus);
}

/**
 * BookingStatus 타입 가드
 * - 이유: 런타임에서 문자열이 유효한 BookingStatus인지 확인
 */
export function isBookingStatus(value: string): value is BookingStatus {
  return Object.values(BookingStatus).includes(value as BookingStatus);
}

/**
 * UserRole 타입 가드
 * - 이유: 런타임에서 문자열이 유효한 UserRole인지 확인
 */
export function isUserRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

// ============================================
// Favorite (찜하기)
// ============================================

/**
 * 찜하기 엔티티
 * - 이유: 사용자가 관심 업체를 저장하는 기능
 * - 관계: User (1) → Favorite (N) → Vendor (N)
 * - 확장: 폴더/카테고리별 그룹핑, 메모 기능 등
 */
export interface Favorite extends Timestamps {
  id: string;
  userId: string;
  vendorId: string;
  memo?: string; // 사용자 메모
  folderId?: string; // 폴더별 분류 (확장용)
}

/**
 * 찜 폴더 엔티티 (확장용)
 * - 이유: "드레스 후보", "스튜디오 비교" 등 그룹핑
 */
export interface FavoriteFolder extends BaseEntity {
  userId: string;
  name: string;
  color?: string; // UI 표시용
  displayOrder: number;
}

/**
 * 찜하기 생성 DTO
 */
export type CreateFavoriteInput = Pick<Favorite, 'userId' | 'vendorId'> &
  Partial<Pick<Favorite, 'memo' | 'folderId'>>;

// ============================================
// Inquiry (문의)
// ============================================

/**
 * 문의 상태 enum
 * - 상태 흐름: PENDING → ANSWERED → CLOSED
 */
export enum InquiryStatus {
  PENDING = 'PENDING', // 답변 대기
  ANSWERED = 'ANSWERED', // 답변 완료
  CLOSED = 'CLOSED', // 종료
}

/**
 * 문의 유형 enum
 * - 이유: 문의 분류로 업체별 응대 우선순위 지정 가능
 */
export enum InquiryType {
  GENERAL = 'GENERAL', // 일반 문의
  PRICE = 'PRICE', // 가격 문의
  AVAILABILITY = 'AVAILABILITY', // 예약 가능 여부
  CUSTOM = 'CUSTOM', // 맞춤 상담
}

/**
 * 문의 엔티티
 * - 이유: 예약 전 상담/문의 기능
 * - 관계: User (1) → Inquiry (N) ← Vendor (1)
 * - 확장: 첨부파일, 읽음 상태, 알림 연동
 */
export interface Inquiry extends BaseEntity {
  userId: string;
  vendorId: string;
  type: InquiryType;
  status: InquiryStatus;
  subject: string;
  content: string;
  attachments?: string[]; // 첨부 이미지 URL
  response?: string;
  respondedAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * 문의 생성 DTO
 */
export type CreateInquiryInput = Pick<Inquiry, 'userId' | 'vendorId' | 'type' | 'subject' | 'content'> &
  Partial<Pick<Inquiry, 'attachments' | 'metadata'>>;

/**
 * 문의 답변 DTO
 */
export type AnswerInquiryInput = Pick<Inquiry, 'response'>;

// ============================================
// @TODO: Future Type Definitions (계획된 확장)
// ============================================

/**
 * @module PricePackage
 * @status PLANNED
 * @priority HIGH
 * @description Vendor가 등록하는 가격 패키지 관련 타입
 *
 * @requirements
 * - Vendor.priceRange, priceMin, priceMax 필드 → PricePackage로 이전
 * - Vendor : PricePackage = 1 : N 관계
 * - 패키지별 상세 항목, 옵션, 추가 비용 정의
 *
 * @planned_types
 * - PricePackage: 기본 패키지 정보 (이름, 가격, 설명)
 * - PackageItem: 패키지 포함 항목
 * - PackageOption: 추가 선택 옵션
 * - SeasonalPricing: 시즌별 가격 변동
 *
 * @dependencies
 * - Booking과 연결 (어떤 패키지로 예약했는지)
 * - Review와 연결 (패키지별 리뷰)
 */

/**
 * @module Notification
 * @status PLANNED
 * @priority MEDIUM
 * @description 사용자 알림 시스템 관련 타입
 *
 * @requirements
 * - User : Notification = 1 : N 관계
 * - 다중 채널 지원 (Push, Email, SMS, In-App)
 * - 알림 설정 (구독/수신거부)
 *
 * @planned_types
 * - Notification: 알림 메시지 엔티티
 * - NotificationTemplate: 알림 템플릿 (다국어 지원)
 * - NotificationSetting: 사용자별 알림 설정
 * - NotificationChannel: 알림 채널 enum (PUSH, EMAIL, SMS, IN_APP)
 * - NotificationCategory: 알림 카테고리 enum (BOOKING, REVIEW, PROMOTION, SYSTEM)
 *
 * @triggers
 * - 예약 상태 변경 시
 * - 새 리뷰 등록 시 (업체)
 * - 프로모션 시작 시
 * - 시뮬레이션 완료 시
 */

/**
 * @module Promotion
 * @status PLANNED
 * @priority MEDIUM
 * @description Vendor 프로모션/쿠폰 관련 타입
 *
 * @requirements
 * - Vendor : Promotion = 1 : N 관계
 * - 할인율/금액, 유효기간, 사용 조건
 * - 사용 횟수 제한, 중복 사용 정책
 *
 * @planned_types
 * - Promotion: 프로모션 캠페인
 * - Coupon: 쿠폰 코드 (Promotion의 하위)
 * - CouponUsage: 쿠폰 사용 이력
 * - DiscountType: 할인 유형 enum (PERCENTAGE, FIXED_AMOUNT, FREE_OPTION)
 * - PromotionCondition: 적용 조건 (최소 금액, 특정 패키지 등)
 *
 * @business_rules
 * - 쿠폰 중복 적용 불가 (기본)
 * - 프로모션 기간 외 자동 비활성화
 * - 사용 횟수 초과 시 자동 만료
 */

/**
 * @module Chat
 * @status PLANNED
 * @priority LOW
 * @description 실시간 채팅 관련 타입
 *
 * @requirements
 * - User ↔ Vendor 1:1 채팅
 * - 메시지 히스토리 저장
 * - 읽음 상태 표시
 *
 * @planned_types
 * - ChatRoom: 채팅방
 * - ChatMessage: 메시지
 * - ChatParticipant: 참여자 정보
 * - MessageType: 메시지 유형 enum (TEXT, IMAGE, FILE, SYSTEM)
 *
 * @technical_notes
 * - WebSocket 기반 실시간 통신
 * - Redis Pub/Sub 또는 Socket.io Room 활용
 */

/**
 * @module Analytics
 * @status PLANNED
 * @priority LOW
 * @description 분석/통계 관련 타입
 *
 * @requirements
 * - Vendor 대시보드용 통계
 * - 조회수, 찜 수, 문의 수 추이
 * - 기간별 집계
 *
 * @planned_types
 * - VendorAnalytics: 업체별 통계 스냅샷
 * - AnalyticsPeriod: 집계 기간 enum (DAILY, WEEKLY, MONTHLY)
 * - ConversionMetrics: 전환율 (조회→문의→예약)
 * - TrafficSource: 유입 경로 분석
 */
