'use client';

export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden animate-pulse">
      {/* 이미지 영역 */}
      <div className="relative h-64 bg-neutral-200" />

      {/* 정보 영역 */}
      <div className="p-6">
        {/* 이름 및 위치 */}
        <div className="mb-3">
          <div className="h-6 bg-neutral-200 rounded-lg w-3/4 mb-2" />
          <div className="h-4 bg-neutral-100 rounded w-1/2" />
        </div>

        {/* 평점 및 리뷰 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-16 bg-neutral-100 rounded-xl" />
          <div className="h-4 w-20 bg-neutral-100 rounded" />
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 bg-neutral-100 rounded-lg" />
          <div className="h-6 w-20 bg-neutral-100 rounded-lg" />
          <div className="h-6 w-14 bg-neutral-100 rounded-lg" />
        </div>

        {/* 가격 */}
        <div className="pt-4 border-t-2 border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-12 bg-neutral-100 rounded mb-1" />
              <div className="h-6 w-24 bg-neutral-200 rounded" />
            </div>
            <div className="h-10 w-20 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VendorCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <VendorCardSkeleton key={index} />
      ))}
    </>
  );
}
