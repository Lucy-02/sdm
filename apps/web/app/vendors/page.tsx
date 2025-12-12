'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Star,
  Heart,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  DollarSign,
  Sparkles,
  SearchX,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react';
import { useVendors } from '@/hooks/useVendors';
import { VendorCardSkeletonGrid } from '@/components/vendor/VendorCardSkeleton';
import type { Vendor } from '@/lib/api-client';

// 카테고리 목록 (API 연동 시 동적으로 변경 가능)
const CATEGORIES = [
  { id: '1', name: '전체', slug: 'all' },
  { id: '2', name: '스튜디오', slug: 'studio' },
  { id: '3', name: '드레스', slug: 'dress' },
  { id: '4', name: '메이크업', slug: 'makeup' },
];

type SortOption = 'rating' | 'reviewCount' | 'priceMin';

export default function VendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search') || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [likedVendors, setLikedVendors] = useState<Set<string>>(new Set());

  // URL 파라미터가 변경되면 카테고리 상태 업데이트
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  // 무한 스크롤 훅
  const {
    vendors,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useVendors({
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    sortBy,
    sortOrder,
  });

  // Intersection Observer로 스크롤 감지
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoadingMore, hasMore, loadMore]
  );

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

  // 가격 포맷팅
  const formatPrice = (min: number, max: number) => {
    const formatNum = (n: number) => {
      if (n >= 10000) return `${Math.floor(n / 10000)}만`;
      return `${n}`;
    };
    return `${formatNum(min)}-${formatNum(max)}원`;
  };

  // 이미지 URL 가져오기
  const getImageUrl = (vendor: Vendor) => {
    const primaryImage = vendor.images?.find(img => img.isPrimary);
    return primaryImage?.url || vendor.images?.[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600';
  };

  // 태그 이름 가져오기
  const getTagNames = (vendor: Vendor) => {
    return vendor.tags?.slice(0, 3).map(tag => tag.name) || [];
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* 필터 바 */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* 타이틀 및 설명 */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mt-3 mb-2">
              {searchFromUrl ? `"${searchFromUrl}" 검색 결과` : '웨딩 업체 찾기'}
            </h1>
          </div>

          {/* 카테고리 및 정렬 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 카테고리 선택 - 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded font-medium text-neutral-600 hover:border-[#C58D8D] transition-all text-sm"
              >
                <span>
                  {selectedCategories.length === 0
                    ? '카테고리'
                    : selectedCategories.length === 1
                      ? CATEGORIES.find(c => c.slug === selectedCategories[0])?.name ||
                        '선택됨'
                      : `${selectedCategories.length}개 선택`}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-neutral-200 rounded shadow-lg z-30 py-2">
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => clearCategories()}
                      className="w-full px-4 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <X size={14} />
                      선택 초기화
                    </button>
                  )}
                  {CATEGORIES.filter(c => c.slug !== 'all').map(category => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="w-4 h-4 accent-[#C58D8D] rounded"
                      />
                      <span className="text-sm text-neutral-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 구분선 */}
            <div className="h-6 w-px bg-neutral-200" />

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="w-8 h-8 rounded transition-all flex justify-center items-center gap-1 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              >
                {sortOrder === 'desc' ? (
                  <ArrowDown size={15} />
                ) : (
                  <ArrowUp size={15} />
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                    sortBy === 'rating'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <TrendingUp className="translate-y-[1px]" size={14} />
                  인기순
                </button>
                <button
                  onClick={() => setSortBy('priceMin')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                    sortBy === 'priceMin'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <DollarSign size={14} />
                  가격순
                </button>
                <button
                  onClick={() => setSortBy('reviewCount')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                    sortBy === 'reviewCount'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Star className="translate-y-[1px]" size={14} />
                  리뷰순
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 업체 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 결과 개수 및 통계 */}
        <div className="mb-8 flex justify-between flex-wrap gap-4">
          <div className="text-neutral-600">
            총 <span className="font-bold text-neutral-800">{total}</span>
            개의 업체
          </div>
          {vendors.length > 0 && (
            <div className="flex gap-2 text-sm">
              <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium">
                ⭐ 평균 평점 {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
              </span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
                💬 총 {vendors.reduce((sum, v) => sum + v.reviewCount, 0)}개 리뷰
              </span>
            </div>
          )}
        </div>

        {/* 초기 로딩 */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <VendorCardSkeletonGrid count={6} />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="py-20 px-4 flex flex-col items-center justify-center gap-6">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h3 className="text-2xl font-bold text-neutral-700 mb-3">데이터를 불러올 수 없습니다</h3>
            <p className="text-neutral-500 mb-6">잠시 후 다시 시도해주세요.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              새로고침
            </button>
          </div>
        )}

        {/* 그리드 레이아웃 */}
        {!isLoading && !error && vendors.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {vendors.map((vendor, index) => (
                <div
                  key={vendor.id}
                  onClick={() => router.push(`/vendors/${vendor.id}`)}
                  className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* 이미지 */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageUrl(vendor)}
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
                      {vendor.rating >= 4.8 && (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                          <Sparkles size={12} />
                          추천
                        </div>
                      )}
                      {vendor.reviewCount >= 100 && (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] text-white text-xs font-bold rounded-full shadow-lg">
                          인기
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
                        <span className="text-sm font-bold text-amber-700">{vendor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-neutral-500 font-medium">
                        리뷰{' '}
                        <span className="text-neutral-700 font-semibold">{vendor.reviewCount}</span>개
                      </span>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getTagNames(vendor).map((tag, idx) => (
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
                          <div className="text-lg font-bold text-neutral-800">
                            {formatPrice(vendor.priceMin, vendor.priceMax)}
                          </div>
                        </div>
                        <button
                          onClick={e => {
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

            {/* 더 불러오기 트리거 */}
            {hasMore && (
              <div
                ref={loadMoreTriggerRef}
                className="mt-8 flex justify-center"
              >
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Loader2 className="animate-spin" size={20} />
                    <span>불러오는 중...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 결과 없음 */}
        {!isLoading && !error && vendors.length === 0 && (
          <div className="py-20 px-4 flex flex-col items-center justify-center gap-6">
            <SearchX strokeWidth={1} color="#404040" size={150} />
            <h3 className="text-2xl font-bold text-neutral-700 mb-3">검색 결과가 없습니다</h3>
            <p className="text-neutral-500 mb-6">다른 검색어나 카테고리를 시도해보세요.</p>
            <button
              onClick={() => {
                clearCategories();
                router.push('/vendors');
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
