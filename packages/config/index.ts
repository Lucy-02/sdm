// Shared constants and configuration

// ============================================
// File Upload
// ============================================

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// ============================================
// Image Processing
// ============================================

export const IMAGE_PROCESSING = {
  THUMBNAIL_WIDTH: 400,
  THUMBNAIL_HEIGHT: 400,
  MAX_DIMENSION: 2048,
  QUALITY: 90,
  FORMAT: 'jpeg',
} as const;

// ============================================
// Pagination
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ============================================
// Vendor Categories
// ============================================

export const VENDOR_CATEGORIES = {
  STUDIO: 'studio',
  MAKEUP: 'makeup',
  DRESS: 'dress',
  VENUE: 'venue',
  CAR: 'car',
  INVITATION: 'invitation',
  PLANNER: 'planner',
  VIDEO: 'video',
  HANBOK: 'hanbok',
  FLOWER: 'flower',
  JEWELRY: 'jewelry',
  HONEYMOON: 'honeymoon',
} as const;

export const VENDOR_CATEGORY_NAMES = {
  [VENDOR_CATEGORIES.STUDIO]: '스튜디오',
  [VENDOR_CATEGORIES.MAKEUP]: '메이크업',
  [VENDOR_CATEGORIES.DRESS]: '예복/드레스',
  [VENDOR_CATEGORIES.VENUE]: '예식장',
  [VENDOR_CATEGORIES.CAR]: '웨딩카/교통편',
  [VENDOR_CATEGORIES.INVITATION]: '청첩장',
  [VENDOR_CATEGORIES.PLANNER]: '웨딩 플래너',
  [VENDOR_CATEGORIES.VIDEO]: '웨딩 영상',
  [VENDOR_CATEGORIES.HANBOK]: '한복/예단',
  [VENDOR_CATEGORIES.FLOWER]: '부케/플라워',
  [VENDOR_CATEGORIES.JEWELRY]: '예물/반지',
  [VENDOR_CATEGORIES.HONEYMOON]: '허니문',
} as const;

// ============================================
// Simulation Concepts
// ============================================

export const SIMULATION_CONCEPTS = {
  CLASSIC: 'classic',
  MODERN: 'modern',
  OUTDOOR: 'outdoor',
  VINTAGE: 'vintage',
  ROMANTIC: 'romantic',
  MINIMAL: 'minimal',
} as const;

export const SIMULATION_CONCEPT_NAMES = {
  [SIMULATION_CONCEPTS.CLASSIC]: '클래식',
  [SIMULATION_CONCEPTS.MODERN]: '모던',
  [SIMULATION_CONCEPTS.OUTDOOR]: '야외',
  [SIMULATION_CONCEPTS.VINTAGE]: '빈티지',
  [SIMULATION_CONCEPTS.ROMANTIC]: '로맨틱',
  [SIMULATION_CONCEPTS.MINIMAL]: '미니멀',
} as const;

// ============================================
// Price Ranges
// ============================================

export const PRICE_RANGES = [
  { min: 0, max: 100, label: '100만원 이하' },
  { min: 100, max: 200, label: '100만원~200만원' },
  { min: 200, max: 300, label: '200만원~300만원' },
  { min: 300, max: 500, label: '300만원~500만원' },
  { min: 500, max: 1000, label: '500만원~1000만원' },
  { min: 1000, max: null, label: '1000만원 이상' },
] as const;

// ============================================
// S3 Paths
// ============================================

export const S3_PATHS = {
  SIMULATION_INPUT: 'simulation/input',
  SIMULATION_OUTPUT: 'simulation/output',
  VENDOR_IMAGES: 'vendor/images',
  REVIEW_IMAGES: 'review/images',
  USER_AVATARS: 'user/avatars',
} as const;

// ============================================
// Redis Keys
// ============================================

export const REDIS_KEYS = {
  SIMULATION_QUEUE: 'queue:simulation',
  SESSION_PREFIX: 'session:',
  CACHE_VENDOR_PREFIX: 'cache:vendor:',
  CACHE_CATEGORY_PREFIX: 'cache:category:',
} as const;

// ============================================
// Rate Limiting
// ============================================

export const RATE_LIMITS = {
  SIMULATION_PER_DAY: 5, // 사용자당 일일 시뮬레이션 횟수
  REVIEW_PER_HOUR: 3, // 사용자당 시간당 리뷰 작성 횟수
  BOOKING_PER_HOUR: 10, // 사용자당 시간당 예약 문의 횟수
} as const;

// ============================================
// WebSocket
// ============================================

export const WS_EVENTS = {
  SIMULATION_STARTED: 'simulation:started',
  SIMULATION_PROGRESS: 'simulation:progress',
  SIMULATION_COMPLETED: 'simulation:completed',
  SIMULATION_FAILED: 'simulation:failed',
} as const;
