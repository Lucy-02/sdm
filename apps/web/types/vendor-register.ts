// Vendor Register 관련 타입 정의

// Owner 정보 (Step 1)
export interface OwnerFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessNumber?: string;
}

// Vendor 정보 (Step 2)
export interface VendorFormData {
  // 기본 정보 (필수)
  name: string;
  categoryId: string;
  location: string;
  description?: string;

  // 연락처
  phone?: string;
  email?: string;
  website?: string;

  // 가격
  priceRange?: string;
  priceMin?: number;
  priceMax?: number;

  // 영업 정보
  businessHours?: BusinessHours;

  // 이미지
  images?: VendorImage[];

  // 태그
  tags?: VendorTag[];

  // 카테고리별 메타데이터
  metadata?: Record<string, unknown>;
}

// 영업시간 타입
export interface BusinessHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

// 이미지 타입
export interface VendorImage {
  url: string;
  type: 'thumbnail' | 'gallery' | 'portfolio';
  displayOrder: number;
  altText?: string;
}

// 태그 타입
export interface VendorTag {
  id: string;
  name: string;
  slug: string;
}

// 초대 토큰 검증 응답
export interface VendorInviteValidation {
  valid: boolean;
  invite?: {
    id: string;
    email?: string;
    categoryId?: string;
    expiresAt: string;
  };
  error?: string;
}

// 회원가입 요청 Body
export interface VendorRegisterRequest {
  inviteToken: string;
  owner: Omit<OwnerFormData, 'confirmPassword'>;
  vendor: VendorFormData;
}

// 회원가입 응답
export interface VendorRegisterResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  vendor?: {
    id: string;
    name: string;
    slug: string;
  };
  error?: string;
}

// 약관 동의 상태
export interface VendorAgreements {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  vendorTerms: boolean;
  marketing: boolean;
}

// 카테고리 옵션
export interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  icon?: string;
}

// 스텝 타입
export type RegisterStep = 1 | 2;
