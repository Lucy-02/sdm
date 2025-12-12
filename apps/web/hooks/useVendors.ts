'use client';

import useSWRInfinite from 'swr/infinite';
import { fetcher, VendorListResponse, VendorQueryParams } from '@/lib/api-client';

const PAGE_SIZE = 12;

interface UseVendorsOptions extends Omit<VendorQueryParams, 'page' | 'limit'> {
  enabled?: boolean;
}

export function useVendors(options: UseVendorsOptions = {}) {
  const { enabled = true, ...queryParams } = options;

  const getKey = (pageIndex: number, previousPageData: VendorListResponse | null) => {
    // 비활성화 상태
    if (!enabled) return null;

    // 이전 페이지 데이터가 없거나 마지막 페이지에 도달한 경우
    if (previousPageData && previousPageData.data.length === 0) return null;
    if (previousPageData && previousPageData.pagination.page >= previousPageData.pagination.totalPages) {
      return null;
    }

    // URL 쿼리 파라미터 구성
    const params = new URLSearchParams();
    params.set('page', String(pageIndex + 1));
    params.set('limit', String(PAGE_SIZE));

    if (queryParams.category) params.set('category', queryParams.category);
    if (queryParams.location) params.set('location', queryParams.location);
    if (queryParams.priceMin !== undefined) params.set('priceMin', String(queryParams.priceMin));
    if (queryParams.priceMax !== undefined) params.set('priceMax', String(queryParams.priceMax));
    if (queryParams.sortBy) params.set('sortBy', queryParams.sortBy);
    if (queryParams.sortOrder) params.set('sortOrder', queryParams.sortOrder);
    if (queryParams.tags && queryParams.tags.length > 0) {
      queryParams.tags.forEach(tag => params.append('tags', tag));
    }

    return `/api/vendors?${params.toString()}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<VendorListResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  // 모든 페이지의 vendors를 평탄화
  const vendors = data ? data.flatMap(page => page.data) : [];

  // 마지막 페이지 정보
  const lastPage = data?.[data.length - 1];
  const pagination = lastPage?.pagination;

  // 더 불러올 데이터 여부
  const hasMore = pagination
    ? pagination.page < pagination.totalPages
    : true;

  // 전체 데이터 개수
  const total = pagination?.total ?? 0;

  // 다음 페이지 로드
  const loadMore = () => {
    if (!isValidating && hasMore) {
      setSize(size + 1);
    }
  };

  // 데이터 리셋 (필터 변경 시)
  const reset = () => {
    setSize(1);
    mutate();
  };

  return {
    vendors,
    total,
    hasMore,
    isLoading,
    isLoadingMore: isValidating && size > 1,
    error,
    loadMore,
    reset,
  };
}
