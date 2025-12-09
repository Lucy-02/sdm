'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Clock,
  Tag,
  FileText,
  Loader2,
  ImagePlus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVendorRegisterStore } from '@/store/useVendorRegisterStore';
import { apiClient } from '@/lib/api-client';
import type { CategoryOption, BusinessHours } from '@/types/vendor-register';

interface Step2VendorInfoProps {
  lockedCategoryId?: string;
}

const DAYS = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
] as const;

export default function Step2VendorInfo({
  lockedCategoryId,
}: Step2VendorInfoProps) {
  const router = useRouter();
  const {
    vendor,
    owner,
    inviteToken,
    isLoading,
    error,
    updateVendor,
    prevStep,
    setLoading,
    setError,
    reset,
  } = useVendorRegisterStore();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 카테고리 목록 로드
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiClient.get('/vendors/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // 숫자 필드 처리
    if (name === 'priceMin' || name === 'priceMax') {
      updateVendor({ [name]: value ? parseInt(value, 10) : undefined });
    } else {
      updateVendor({ [name]: value });
    }
  };

  const handleBusinessHoursChange = (day: string, value: string) => {
    updateVendor({
      businessHours: {
        ...(vendor.businessHours || {}),
        [day]: value,
      },
    });
  };

  const isFormValid =
    vendor.name &&
    vendor.categoryId &&
    vendor.location;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vendor-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteToken,
          owner: {
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            password: owner.password,
            businessNumber: owner.businessNumber,
          },
          vendor: {
            ...vendor,
            // 빈 값 제거
            phone: vendor.phone || undefined,
            email: vendor.email || undefined,
            website: vendor.website || undefined,
            description: vendor.description || undefined,
            priceRange: vendor.priceRange || undefined,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '회원가입에 실패했습니다.');
      }

      // 성공 시 스토어 초기화 및 리다이렉트
      reset();
      router.push('/vendor/dashboard?welcome=true');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err instanceof Error ? err.message : '회원가입에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-800">업체 정보</h2>
        <p className="text-sm text-neutral-500 mt-1">
          등록할 업체의 상세 정보를 입력해주세요
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          기본 정보
        </h3>

        {/* 업체명 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            업체명 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={vendor.name}
            onChange={handleInputChange}
            placeholder="예: 스튜디오 봄"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={lockedCategoryId || vendor.categoryId}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all ${
              lockedCategoryId ? 'bg-neutral-100 cursor-not-allowed' : ''
            }`}
            required
            disabled={!!lockedCategoryId || isLoading || loadingCategories}
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {lockedCategoryId && (
            <p className="mt-1 text-xs text-neutral-500">
              초대 링크로 지정된 카테고리입니다
            </p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            주소 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              id="location"
              name="location"
              type="text"
              value={vendor.location}
              onChange={handleInputChange}
              placeholder="서울특별시 강남구 테헤란로 123"
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 업체 소개 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            업체 소개 <span className="text-neutral-400">(선택)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
            <textarea
              id="description"
              name="description"
              value={vendor.description || ''}
              onChange={handleInputChange}
              placeholder="업체를 소개해주세요"
              rows={4}
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 연락처 섹션 */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          연락처
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 업체 전화번호 */}
          <div>
            <label
              htmlFor="vendorPhone"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              업체 전화번호
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                id="vendorPhone"
                name="phone"
                type="tel"
                value={vendor.phone || ''}
                onChange={handleInputChange}
                placeholder="02-1234-5678"
                className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 업체 이메일 */}
          <div>
            <label
              htmlFor="vendorEmail"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              업체 이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                id="vendorEmail"
                name="email"
                type="email"
                value={vendor.email || ''}
                onChange={handleInputChange}
                placeholder="contact@studio.com"
                className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 웹사이트 */}
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            웹사이트
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              id="website"
              name="website"
              type="url"
              value={vendor.website || ''}
              onChange={handleInputChange}
              placeholder="https://www.example.com"
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 가격 정보 섹션 */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          가격 정보
        </h3>

        {/* 가격 표시 */}
        <div>
          <label
            htmlFor="priceRange"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            가격대 표시
          </label>
          <input
            id="priceRange"
            name="priceRange"
            type="text"
            value={vendor.priceRange || ''}
            onChange={handleInputChange}
            placeholder="예: 100만원~200만원"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 최소 가격 */}
          <div>
            <label
              htmlFor="priceMin"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              최소 가격 (만원)
            </label>
            <input
              id="priceMin"
              name="priceMin"
              type="number"
              min="0"
              value={vendor.priceMin || ''}
              onChange={handleInputChange}
              placeholder="100"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          {/* 최대 가격 */}
          <div>
            <label
              htmlFor="priceMax"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              최대 가격 (만원)
            </label>
            <input
              id="priceMax"
              name="priceMax"
              type="number"
              min="0"
              value={vendor.priceMax || ''}
              onChange={handleInputChange}
              placeholder="200"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 영업시간 섹션 */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          영업시간
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DAYS.map((day) => (
            <div key={day.key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {day.label}요일
              </label>
              <input
                type="text"
                value={(vendor.businessHours as BusinessHours)?.[day.key] || ''}
                onChange={(e) =>
                  handleBusinessHoursChange(day.key, e.target.value)
                }
                placeholder="09:00-18:00"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500">
          휴무일은 &quot;휴무&quot;로 입력해주세요
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={prevStep}
          disabled={isLoading}
          variant="outline"
          className="flex-1 h-12 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="flex-1 h-12 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] hover:from-[#B36B6B] hover:to-[#A05A5A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              가입 중...
            </>
          ) : (
            <>
              가입 완료
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
