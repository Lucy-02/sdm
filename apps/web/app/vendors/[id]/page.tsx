'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Check,
  Sparkles,
  Camera,
  ExternalLink,
} from 'lucide-react';

// 목업 데이터 타입
interface VendorImage {
  url: string;
  type: 'portfolio' | 'interior' | 'product';
  altText?: string;
  externalLink?: string;
}

interface VendorDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description: string;

  // 연락처
  phone: string;
  email: string;
  website?: string;

  // 위치
  location: string;
  lat?: number;
  lng?: number;

  // 가격
  priceRange: string;
  priceMin: number;
  priceMax: number;

  // 영업시간
  businessHours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };

  // 태그
  tags: string[];

  // 이미지
  images: VendorImage[];

  // 메타데이터
  metadata: {
    studioSize?: string;
    equipments?: string[];
    certifications?: string[];
    specialties?: string[];
    capacity?: number;
    parkingSpots?: number;
  };

  // 통계
  rating: number;
  reviewCount: number;
  bookingCount: number;
  favoriteCount: number;

  // 상태
  isVerified: boolean;
  isPremium: boolean;
}

// 목업 데이터
const MOCK_VENDOR_DATA: Record<string, VendorDetail> = {
  '1': {
    id: '1',
    name: '로맨틱 스튜디오',
    slug: 'romantic-studio',
    category: 'studio',
    categoryName: '스튜디오',
    description:
      '자연광이 아름답게 들어오는 로맨틱한 분위기의 웨딩 스튜디오입니다. 10년 경력의 전문 포토그래퍼가 여러분의 소중한 순간을 특별하게 담아드립니다. 야외 촬영과 실내 촬영 모두 가능하며, 다양한 콘셉트를 제공합니다.',

    phone: '02-1234-5678',
    email: 'contact@romantic-studio.com',
    website: 'https://romantic-studio.com',

    location: '서울특별시 강남구 청담동 123-45',
    lat: 37.5219,
    lng: 127.0411,

    priceRange: '100-200만원',
    priceMin: 100,
    priceMax: 200,

    businessHours: {
      mon: '10:00 - 19:00',
      tue: '10:00 - 19:00',
      wed: '10:00 - 19:00',
      thu: '10:00 - 19:00',
      fri: '10:00 - 19:00',
      sat: '09:00 - 18:00',
      sun: '예약제',
    },

    tags: ['야외촬영', '빈티지', '감성', '자연광', '한복촬영'],

    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        type: 'portfolio',
        altText: '야외 웨딩 촬영',
        externalLink: 'https://romantic-studio.com/portfolio/1',
      },
      {
        url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
        type: 'portfolio',
        altText: '실내 스튜디오 촬영',
        externalLink: 'https://romantic-studio.com/portfolio/2',
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
        type: 'interior',
        altText: '스튜디오 내부',
      },
      {
        url: 'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=800',
        type: 'portfolio',
        altText: '감성 웨딩 촬영',
        externalLink: 'https://romantic-studio.com/portfolio/3',
      },
      {
        url: 'https://images.unsplash.com/photo-1583852477421-62ebf1dfcbe7?w=800',
        type: 'portfolio',
        altText: '한복 웨딩 촬영',
        externalLink: 'https://romantic-studio.com/portfolio/4',
      },
      {
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        type: 'interior',
        altText: '촬영 장비',
      },
    ],

    metadata: {
      studioSize: '200평',
      equipments: ['4K 카메라', '드론', '조명 장비', '메이크업룸'],
      certifications: ['사진작가협회 정회원', '웨딩포토 전문가'],
      specialties: ['야외촬영', '한복촬영', '감성촬영'],
    },

    rating: 4.8,
    reviewCount: 128,
    bookingCount: 342,
    favoriteCount: 567,

    isVerified: true,
    isPremium: true,
  },
  '2': {
    id: '2',
    name: '엘레강스 드레스',
    slug: 'elegance-dress',
    category: 'dress',
    categoryName: '드레스',
    description:
      '유럽에서 직수입한 프리미엄 웨딩드레스와 맞춤 제작 서비스를 제공합니다. 20년 경력의 디자이너가 신부님의 체형과 스타일에 맞는 완벽한 드레스를 제안해드립니다.',

    phone: '02-2345-6789',
    email: 'info@elegance-dress.com',
    website: 'https://elegance-dress.com',

    location: '서울특별시 서초구 반포동 456-78',
    lat: 37.5048,
    lng: 127.0037,

    priceRange: '150-300만원',
    priceMin: 150,
    priceMax: 300,

    businessHours: {
      mon: '11:00 - 20:00',
      tue: '11:00 - 20:00',
      wed: '11:00 - 20:00',
      thu: '11:00 - 20:00',
      fri: '11:00 - 20:00',
      sat: '10:00 - 19:00',
      sun: '10:00 - 18:00',
    },

    tags: ['커스텀', '럭셔리', '수입드레스', '맞춤제작', '디자이너'],

    images: [
      {
        url: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=800',
        type: 'product',
        altText: '럭셔리 웨딩드레스',
        externalLink: 'https://elegance-dress.com/collection/1',
      },
      {
        url: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=800',
        type: 'product',
        altText: '프린세스 드레스',
        externalLink: 'https://elegance-dress.com/collection/2',
      },
      {
        url: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=800',
        type: 'interior',
        altText: '매장 내부',
      },
      {
        url: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=800',
        type: 'product',
        altText: '맞춤 드레스',
        externalLink: 'https://elegance-dress.com/collection/3',
      },
    ],

    metadata: {
      certifications: ['패션디자이너협회 회원', '맞춤복 전문가'],
      specialties: ['맞춤제작', '수입드레스', '디자인 컨설팅'],
    },

    rating: 4.9,
    reviewCount: 256,
    bookingCount: 489,
    favoriteCount: 892,

    isVerified: true,
    isPremium: true,
  },
};

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 목업 데이터 가져오기
  const vendor = MOCK_VENDOR_DATA[vendorId];

  // 데이터가 없으면 404
  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">업체를 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/vendors')}
            className="px-6 py-3 bg-[#C58D8D] text-white rounded-xl font-semibold hover:bg-[#B36B6B] transition-colors"
          >
            업체 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const selectedImage = vendor.images[selectedImageIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* 상단 네비게이션 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/vendors')}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">업체 목록</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2.5 bg-white border-2 border-neutral-200 rounded-full hover:border-red-300 transition-all"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
                />
              </button>
              <button className="p-2.5 bg-white border-2 border-neutral-200 rounded-full hover:border-[#C58D8D] transition-all">
                <Share2 size={20} className="text-neutral-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 상단 영역: 웨딩사진 미리보기 버튼 & 기본 정보 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* 웨딩사진 미리보기 버튼 - 가로 전체 */}
          <button
            onClick={() => router.push('/simulator')}
            className="w-full px-8 py-8 bg-gradient-to-r from-[#C58D8D] via-[#B87B7B] to-[#B36B6B] text-white hover:shadow-2xl transition-all duration-500 hover:brightness-110 group relative overflow-hidden"
          >
            {/* 배경 애니메이션 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative flex items-center justify-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Camera size={32} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium opacity-90 mb-1">이 업체에서</div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                  AI 웨딩사진 미리보기
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div className="text-sm font-medium opacity-90 mt-1">
                  우리 얼굴로 웨딩 사진을 미리 확인해보세요!
                </div>
              </div>
            </div>
          </button>

          {/* 업체 정보 */}
          <div className="p-8">
            {/* 헤더 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800">{vendor.name}</h1>
                {vendor.isVerified && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-blue-200">
                    <Check size={16} />
                    인증업체
                  </div>
                )}
                {vendor.isPremium && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles size={16} />
                    프리미엄
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-neutral-600 mb-4 flex-wrap">
                <span className="px-4 py-1.5 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl font-semibold text-sm border border-neutral-200">
                  {vendor.categoryName}
                </span>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#C58D8D]" />
                  <span className="text-sm font-medium">{vendor.location}</span>
                </div>
              </div>

              {/* 평점 및 통계 */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 rounded-xl border-2 border-amber-200">
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-lg text-amber-700">{vendor.rating}</span>
                  </div>
                  <span className="text-sm text-neutral-600">
                    리뷰 <span className="font-bold text-neutral-800">{vendor.reviewCount}</span>개
                  </span>
                </div>
                <div className="px-4 py-2 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">
                    예약 <span className="font-bold text-neutral-800">{vendor.bookingCount}</span>건
                  </span>
                </div>
                <div className="px-4 py-2 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">
                    찜 <span className="font-bold text-neutral-800">{vendor.favoriteCount}</span>명
                  </span>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <p className="text-neutral-600 leading-relaxed mb-6 text-base">{vendor.description}</p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-700 text-sm font-medium rounded-xl border border-neutral-200 hover:border-[#C58D8D] hover:text-[#C58D8D] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 중단 영역: 상세 정보 & 지도 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 연락처 및 영업시간 */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C58D8D] to-[#B36B6B] rounded-full" />
              업체 정보
            </h2>

            {/* 연락처 */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-[#C58D8D] transition-colors group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <Phone size={20} className="text-[#C58D8D]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-500 mb-1 font-medium">전화번호</div>
                  <a
                    href={`tel:${vendor.phone}`}
                    className="font-bold text-neutral-800 hover:text-[#C58D8D] transition-colors"
                  >
                    {vendor.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-[#C58D8D] transition-colors group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <Mail size={20} className="text-[#C58D8D]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-500 mb-1 font-medium">이메일</div>
                  <a
                    href={`mailto:${vendor.email}`}
                    className="font-bold text-neutral-800 hover:text-[#C58D8D] transition-colors break-all"
                  >
                    {vendor.email}
                  </a>
                </div>
              </div>

              {vendor.website && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-[#C58D8D] transition-colors group">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <Globe size={20} className="text-[#C58D8D]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-neutral-500 mb-1 font-medium">웹사이트</div>
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-neutral-800 hover:text-[#C58D8D] transition-colors flex items-center gap-1"
                    >
                      방문하기
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <DollarSign size={20} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-amber-600 mb-1 font-medium">예상 가격</div>
                  <div className="font-bold text-lg text-amber-700">{vendor.priceRange}</div>
                </div>
              </div>
            </div>

            {/* 영업시간 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-[#C58D8D]" />
                <h3 className="text-lg font-bold text-neutral-800">영업시간</h3>
              </div>
              <div className="bg-gradient-to-br from-neutral-50 to-white p-4 rounded-2xl border border-neutral-100">
                <div className="space-y-2">
                  {Object.entries(vendor.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2.5 border-b border-neutral-100 last:border-0">
                      <span className="text-sm font-bold text-neutral-700 uppercase">{day}</span>
                      <span className="text-sm font-semibold text-neutral-800 px-3 py-1 bg-white rounded-lg">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 메타데이터 */}
            {vendor.metadata && (
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#C58D8D]" />
                  특징
                </h3>
                <div className="space-y-3">
                  {vendor.metadata.studioSize && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                      <Check size={18} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">
                        스튜디오 규모: <span className="font-bold text-green-700">{vendor.metadata.studioSize}</span>
                      </span>
                    </div>
                  )}
                  {vendor.metadata.equipments && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <Check size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-700">
                        보유 장비:{' '}
                        <span className="font-bold text-blue-700">{vendor.metadata.equipments.join(', ')}</span>
                      </div>
                    </div>
                  )}
                  {vendor.metadata.certifications && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <Check size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-700">
                        자격증: <span className="font-bold text-purple-700">{vendor.metadata.certifications.join(', ')}</span>
                      </div>
                    </div>
                  )}
                  {vendor.metadata.specialties && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <Check size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-700">
                        전문 분야: <span className="font-bold text-amber-700">{vendor.metadata.specialties.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 예약 문의 버튼 */}
            <button className="w-full mt-8 px-6 py-5 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Calendar size={22} className="relative z-10" />
              <span className="relative z-10 text-lg">예약 문의하기</span>
            </button>
          </div>

          {/* 지도 영역 */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#C58D8D] to-[#B36B6B] rounded-full" />
              위치
            </h2>
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl border border-neutral-100">
                <MapPin size={22} className="mt-1 flex-shrink-0 text-[#C58D8D]" />
                <span className="font-semibold text-neutral-800">{vendor.location}</span>
              </div>
            </div>

            {/* 지도 영역 (구현 안함, 영역만) */}
            <div className="w-full h-[400px] bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 hover:border-[#C58D8D] transition-colors">
              <div className="text-center">
                <div className="p-4 bg-white rounded-full shadow-md mx-auto mb-4 w-fit">
                  <MapPin size={48} className="text-[#C58D8D]" />
                </div>
                <p className="text-neutral-600 font-bold text-lg">지도 영역</p>
                <p className="text-sm text-neutral-400 mt-2">(구글 맵 또는 카카오맵 API 연동 예정)</p>
              </div>
            </div>

            {/* 길찾기 버튼 */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="px-5 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-neutral-800 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                <MapPin size={18} />
                카카오맵
              </button>
              <button className="px-5 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                <MapPin size={18} />
                네이버지도
              </button>
            </div>
          </div>
        </div>

        {/* 하단 영역: 업체 사진 갤러리 */}
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-[#C58D8D] to-[#B36B6B] rounded-full" />
            갤러리
          </h2>

          {/* 메인 이미지 */}
          <div className="mb-6">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-neutral-100 shadow-xl group">
              <Image
                src={selectedImage?.url || vendor.images[0].url}
                alt={selectedImage?.altText || '업체 이미지'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 외부 링크 버튼 */}
              {selectedImage?.externalLink && (
                <a
                  href={selectedImage.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-6 right-6 px-5 py-3 bg-white/95 backdrop-blur-sm text-neutral-800 font-bold rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-2xl hover:scale-105 duration-300"
                >
                  <span>업체 사이트에서 보기</span>
                  <ExternalLink size={18} />
                </a>
              )}

              {/* 이미지 타입 배지 */}
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm font-bold rounded-xl shadow-lg">
                  {selectedImage?.type === 'portfolio'
                    ? '📸 포트폴리오'
                    : selectedImage?.type === 'interior'
                      ? '🏢 인테리어'
                      : '🎁 제품'}
                </span>
              </div>

              {/* 이미지 카운터 */}
              <div className="absolute bottom-6 right-6">
                <span className="px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm font-bold rounded-xl shadow-lg">
                  {selectedImageIndex + 1} / {vendor.images.length}
                </span>
              </div>
            </div>
          </div>

          {/* 썸네일 그리드 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {vendor.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                  selectedImageIndex === idx
                    ? 'border-[#C58D8D] shadow-xl scale-105 ring-4 ring-[#C58D8D]/20'
                    : 'border-neutral-200 hover:border-[#C58D8D] hover:shadow-lg hover:scale-105'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `이미지 ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                />

                {/* 선택된 이미지 오버레이 */}
                {selectedImageIndex === idx && (
                  <div className="absolute inset-0 bg-[#C58D8D]/20 flex items-center justify-center">
                    <Check size={24} className="text-white drop-shadow-lg" />
                  </div>
                )}

                {/* 외부 링크 아이콘 */}
                {image.externalLink && (
                  <div className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-lg backdrop-blur-sm">
                    <ExternalLink size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="h-20" />
    </main>
  );
}
