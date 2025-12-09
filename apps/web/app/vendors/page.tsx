'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Star,
  Heart,
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  Sparkles,
  SearchX,
  ChevronDown,
  X,
} from 'lucide-react';

// 목업 데이터
const MOCK_CATEGORIES = [
  { id: '1', name: '전체', slug: 'all' },
  { id: '2', name: '스튜디오', slug: 'studio' },
  { id: '3', name: '드레스', slug: 'dress' },
  { id: '4', name: '메이크업', slug: 'makeup' },
];

const MOCK_VENDORS = [
  {
    id: '1',
    name: '로맨틱 스튜디오',
    category: 'studio',
    location: '강남구 청담동',
    priceRange: '100-200만원',
    rating: 4.8,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    tags: ['야외촬영', '빈티지', '감성'],
    liked: false,
    popularity: 95,
    discount: 10,
  },
  {
    id: '2',
    name: '엘레강스 드레스',
    category: 'dress',
    location: '서초구 반포동',
    priceRange: '150-300만원',
    rating: 4.9,
    reviewCount: 256,
    image: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=600',
    tags: ['커스텀', '럭셔리', '수입드레스'],
    liked: true,
    popularity: 98,
    featured: true,
  },
  {
    id: '3',
    name: '글로우 메이크업',
    category: 'makeup',
    location: '강남구 신사동',
    priceRange: '30-60만원',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600',
    tags: ['웨딩메이크업', '스타일링', '헤어'],
    liked: false,
    popularity: 87,
  },
  {
    id: '4',
    name: '모던 포토 스튜디오',
    category: 'studio',
    location: '마포구 연남동',
    priceRange: '120-180만원',
    rating: 4.6,
    reviewCount: 143,
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600',
    tags: ['실내촬영', '모던', '심플'],
    liked: false,
    popularity: 82,
    discount: 15,
  },
  {
    id: '5',
    name: '프리미엄 웨딩홀',
    category: 'venue',
    location: '송파구 잠실동',
    priceRange: '500-1000만원',
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c28c?w=600',
    tags: ['대형홀', '야외정원', '호텔급'],
    liked: true,
    popularity: 99,
    featured: true,
  },
  {
    id: '6',
    name: '한가람 한복',
    category: 'hanbok',
    location: '종로구 인사동',
    priceRange: '80-150만원',
    rating: 4.8,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1583852477421-62ebf1dfcbe7?w=600',
    tags: ['전통한복', '맞춤제작', '퓨전한복'],
    liked: false,
    popularity: 91,
  },
  {
    id: '7',
    name: '아뜰리에 드레스',
    category: 'dress',
    location: '강남구 압구정동',
    priceRange: '200-400만원',
    rating: 4.9,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1594552072238-6d94d6d28415?w=600',
    tags: ['맞춤제작', '디자이너', '프리미엄'],
    liked: false,
    popularity: 96,
    featured: true,
  },
  {
    id: '8',
    name: '네이처 스튜디오',
    category: 'studio',
    location: '용산구 한남동',
    priceRange: '150-250만원',
    rating: 4.7,
    reviewCount: 221,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
    tags: ['자연광', '감성', '야외촬영'],
    liked: true,
    popularity: 93,
  },
  {
    id: '9',
    name: '뷰티풀 메이크업',
    category: 'makeup',
    location: '강남구 역삼동',
    priceRange: '40-80만원',
    rating: 4.6,
    reviewCount: 134,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600',
    tags: ['자연스러운', '글로우', '맞춤'],
    liked: false,
    popularity: 85,
    discount: 20,
  },
  {
    id: '10',
    name: '클래식 웨딩홀',
    category: 'venue',
    location: '서초구 서초동',
    priceRange: '300-600만원',
    rating: 4.8,
    reviewCount: 187,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600',
    tags: ['중형홀', '실내정원', '클래식'],
    liked: false,
    popularity: 89,
  },
  {
    id: '11',
    name: '퓨전 한복',
    category: 'hanbok',
    location: '강남구 가로수길',
    priceRange: '100-180만원',
    rating: 4.7,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1617722941580-8d765626e8df?w=600',
    tags: ['현대한복', '컬러풀', '개성'],
    liked: false,
    popularity: 88,
  },
  {
    id: '12',
    name: '럭셔리 스튜디오',
    category: 'studio',
    location: '강남구 청담동',
    priceRange: '200-350만원',
    rating: 4.9,
    reviewCount: 289,
    image: 'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=600',
    tags: ['고급스러운', '프리미엄', '럭셔리'],
    liked: true,
    popularity: 97,
    featured: true,
  },
];

type SortOption = 'popularity' | 'price' | 'rating';

export default function VendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // URL 파라미터가 변경되면 카테고리 상태 업데이트
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(slug)) {
        return prev.filter(c => c !== slug);
      }
      return [...prev, slug];
    });
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [likedVendors, setLikedVendors] = useState<Set<string>>(
    new Set(MOCK_VENDORS.filter(v => v.liked).map(v => v.id))
  );

  // 필터링 및 정렬
  const filteredAndSortedVendors = MOCK_VENDORS.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(vendor.category);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'price':
        const aPrice = parseInt(a.priceRange.split('-')[0] ?? '0');
        const bPrice = parseInt(b.priceRange.split('-')[0] ?? '0');
        return aPrice - bPrice;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleLike = (vendorId: string) => {
    setLikedVendors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };

  const isPopular = (popularity: number) => popularity >= 95;

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* 타이틀 및 설명 */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-2">웨딩 업체 찾기</h1>
            <p className="text-neutral-500 text-sm sm:text-base">
              완벽한 결혼식을 위한 최고의 파트너를 만나보세요
            </p>
          </div>

          {/* 검색 및 카테고리 */}
          <div className="flex gap-3 mb-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={20}
              />
              <input
                type="text"
                placeholder="업체 이름으로 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* 카테고리 선택 - 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-2xl font-semibold text-neutral-600 hover:border-[#C58D8D] transition-all shadow-sm min-w-[160px]"
              >
                <span>
                  {selectedCategories.length === 0
                    ? '카테고리 선택'
                    : selectedCategories.length === 1
                      ? MOCK_CATEGORIES.find(c => c.slug === selectedCategories[0])?.name || '선택됨'
                      : `${selectedCategories.length}개 선택됨`}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg z-30 py-2">
                  {/* 전체 선택 해제 버튼 */}
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => {
                        clearCategories();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <X size={16} />
                      선택 초기화
                    </button>
                  )}
                  {MOCK_CATEGORIES.filter(c => c.slug !== 'all').map(category => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="w-4 h-4 accent-[#C58D8D] rounded"
                      />
                      <span className="text-sm font-medium text-neutral-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-neutral-600 font-medium">
              <ArrowUpDown size={18} />
              <span className="text-sm">정렬</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  sortBy === 'popularity'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <TrendingUp size={14} />
                인기순
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  sortBy === 'price'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <DollarSign size={14} />
                가격순
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  sortBy === 'rating'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Star size={14} />
                별점순
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 업체 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 결과 개수 및 통계 */}
        <div className="mb-8 flex justify-between flex-wrap gap-4">
          <div className="text-neutral-600">
            총{' '}
            <span className="font-bold text-neutral-800">
              {filteredAndSortedVendors.length}
            </span>
            개의 업체
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium">
              ⭐ 평균 평점 4.8
            </span>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
              💬 총 {filteredAndSortedVendors.reduce((sum, v) => sum + v.reviewCount, 0)}개 리뷰
            </span>
          </div>
        </div>

        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSortedVendors.map((vendor, index) => (
            <div
              key={vendor.id}
              onClick={() => router.push(`/vendors/${vendor.id}`)}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 이미지 */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 좋아요 버튼 */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleLike(vendor.id);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${likedVendors.has(vendor.id) ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
                  />
                </button>

                {/* 배지들 */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {vendor.featured && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={12} />
                      추천
                    </div>
                  )}
                  {isPopular(vendor.popularity) && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white text-xs font-bold rounded-full shadow-lg">
                      인기
                    </div>
                  )}
                  {vendor.discount && (
                    <div className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {vendor.discount}% 할인
                    </div>
                  )}
                </div>
              </div>

              {/* 정보 */}
              <div className="p-6">
                {/* 이름 및 위치 */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-[#C58D8D] transition-colors">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                    <MapPin size={16} className="text-neutral-400" />
                    <span>{vendor.location}</span>
                  </div>
                </div>

                {/* 평점 및 리뷰 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-amber-700">{vendor.rating}</span>
                  </div>
                  <span className="text-sm text-neutral-500 font-medium">
                    리뷰{' '}
                    <span className="text-neutral-700 font-semibold">{vendor.reviewCount}</span>개
                  </span>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-600 text-xs font-medium rounded-lg border border-neutral-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 가격 */}
                <div className="pt-4 border-t-2 border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">예상 가격</div>
                      <div className="text-lg font-bold text-neutral-800">{vendor.priceRange}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/vendors/${vendor.id}`);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 결과 없음 */}
        {filteredAndSortedVendors.length === 0 && (
          <div className="py-20 px-4 flex flex-col items-center justify-center gap-6">
            <SearchX strokeWidth={1} color='#404040' size={150} />
            <h3 className="text-2xl font-bold text-neutral-700 mb-3">검색 결과가 없습니다</h3>
            <p className="text-neutral-500 mb-6">다른 검색어나 카테고리를 시도해보세요.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearCategories();
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              전체 보기
            </button>
          </div>
        )}
      </div>

      {/* 하단 여백 */}
      <div className="h-20" />
    </main>
  );
}
