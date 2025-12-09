'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Building2 } from 'lucide-react';
import { useVendorRegisterStore } from '@/store/useVendorRegisterStore';
import { validateInviteToken } from '@/lib/vendor-invite';
import Step1OwnerInfo from './steps/Step1OwnerInfo';
import Step2VendorInfo from './steps/Step2VendorInfo';

export default function VendorRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<{
    id: string;
    email?: string;
    categoryId?: string;
  } | null>(null);

  const { step, setInviteToken, updateOwner, updateVendor, reset } =
    useVendorRegisterStore();

  // 토큰 검증
  useEffect(() => {
    async function validate() {
      if (!token) {
        setTokenError('초대 링크가 필요합니다.');
        setValidating(false);
        return;
      }

      const result = await validateInviteToken(token);

      if (!result.valid) {
        setTokenError(result.error || '유효하지 않은 초대 링크입니다.');
        setValidating(false);
        return;
      }

      // 토큰 저장
      setInviteToken(token);
      setInviteData(result.invite!);

      // 초대 데이터로 폼 초기화
      if (result.invite?.email) {
        updateOwner({ email: result.invite.email });
      }
      if (result.invite?.categoryId) {
        updateVendor({ categoryId: result.invite.categoryId });
      }

      setValidating(false);
    }

    validate();
  }, [token, setInviteToken, updateOwner, updateVendor]);

  // 로딩 화면
  if (validating) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C58D8D] mx-auto mb-4" />
          <p className="text-neutral-600">초대 링크를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 토큰 오류 화면
  if (tokenError) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">
              접근할 수 없습니다
            </h1>
            <p className="text-neutral-600 mb-6">{tokenError}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-2xl shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            업체 회원가입
          </h1>
          <p className="text-neutral-500 text-sm">
            SDM 파트너가 되어 더 많은 고객을 만나보세요
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">
              {step === 1 ? '1단계: 대표자 정보' : '2단계: 업체 정보'}
            </span>
            <span className="text-sm text-neutral-500">{step}/2</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] rounded-full transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        {/* 스텝별 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && <Step1OwnerInfo lockedEmail={inviteData?.email} />}
          {step === 2 && (
            <Step2VendorInfo lockedCategoryId={inviteData?.categoryId} />
          )}
        </div>
      </div>
    </div>
  );
}
