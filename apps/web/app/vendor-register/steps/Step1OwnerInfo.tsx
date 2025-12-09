'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  ArrowRight,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVendorRegisterStore } from '@/store/useVendorRegisterStore';

interface Step1OwnerInfoProps {
  lockedEmail?: string;
}

export default function Step1OwnerInfo({ lockedEmail }: Step1OwnerInfoProps) {
  const { owner, agreements, updateOwner, setAgreements, setAllAgreements, nextStep } =
    useVendorRegisterStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateOwner({ [name]: value });
  };

  const passwordValidation = {
    length: owner.password.length >= 8,
    letter: /[a-zA-Z]/.test(owner.password),
    number: /[0-9]/.test(owner.password),
    match:
      owner.password === owner.confirmPassword && owner.confirmPassword !== '',
  };

  const isPasswordValid =
    passwordValidation.length &&
    passwordValidation.letter &&
    passwordValidation.number;

  const isFormValid =
    agreements.terms &&
    agreements.privacy &&
    agreements.vendorTerms &&
    isPasswordValid &&
    passwordValidation.match &&
    owner.name &&
    owner.email &&
    owner.phone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-800">대표자 정보</h2>
        <p className="text-sm text-neutral-500 mt-1">
          업체를 대표하는 회원 정보를 입력해주세요
        </p>
      </div>

      {/* 이름 */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          대표자 이름
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="name"
            name="name"
            type="text"
            value={owner.name}
            onChange={handleInputChange}
            placeholder="홍길동"
            className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      {/* 이메일 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          이메일
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={lockedEmail || owner.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className={`w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all ${
              lockedEmail ? 'bg-neutral-100 cursor-not-allowed' : ''
            }`}
            required
            disabled={!!lockedEmail}
          />
        </div>
        {lockedEmail && (
          <p className="mt-1 text-xs text-neutral-500">
            초대된 이메일로 가입됩니다
          </p>
        )}
      </div>

      {/* 전화번호 */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          휴대폰 번호
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="phone"
            name="phone"
            type="tel"
            value={owner.phone}
            onChange={handleInputChange}
            placeholder="010-1234-5678"
            className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      {/* 사업자등록번호 (선택) */}
      <div>
        <label
          htmlFor="businessNumber"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          사업자등록번호 <span className="text-neutral-400">(선택)</span>
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="businessNumber"
            name="businessNumber"
            type="text"
            value={owner.businessNumber || ''}
            onChange={handleInputChange}
            placeholder="123-45-67890"
            className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          비밀번호
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={owner.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            className="w-full pl-11 pr-11 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {owner.password && (
          <div className="mt-2 space-y-1">
            <div
              className={`flex items-center gap-2 text-xs ${
                passwordValidation.length ? 'text-green-600' : 'text-neutral-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>8자 이상</span>
            </div>
            <div
              className={`flex items-center gap-2 text-xs ${
                passwordValidation.letter ? 'text-green-600' : 'text-neutral-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>영문 포함</span>
            </div>
            <div
              className={`flex items-center gap-2 text-xs ${
                passwordValidation.number ? 'text-green-600' : 'text-neutral-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>숫자 포함</span>
            </div>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          비밀번호 확인
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={owner.confirmPassword}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력하세요"
            className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all ${
              owner.confirmPassword && !passwordValidation.match
                ? 'border-red-300'
                : 'border-neutral-300'
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {owner.confirmPassword && !passwordValidation.match && (
          <p className="mt-1.5 text-xs text-red-500">
            비밀번호가 일치하지 않습니다
          </p>
        )}
        {passwordValidation.match && (
          <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            비밀번호가 일치합니다
          </p>
        )}
      </div>

      {/* 약관 동의 */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-neutral-50 rounded-xl">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={(e) => setAllAgreements(e.target.checked)}
            className="w-5 h-5 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
          />
          <span className="text-sm font-semibold text-neutral-800">
            전체 동의
          </span>
        </label>

        <div className="space-y-2 pl-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={(e) => setAgreements({ terms: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
            />
            <span className="text-sm text-neutral-600">
              <span className="text-[#C58D8D]">[필수]</span> 이용약관 동의
            </span>
            <Link
              href="/terms"
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-600"
            >
              보기
            </Link>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.privacy}
              onChange={(e) => setAgreements({ privacy: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
            />
            <span className="text-sm text-neutral-600">
              <span className="text-[#C58D8D]">[필수]</span> 개인정보 처리방침
              동의
            </span>
            <Link
              href="/privacy"
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-600"
            >
              보기
            </Link>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.vendorTerms}
              onChange={(e) => setAgreements({ vendorTerms: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
            />
            <span className="text-sm text-neutral-600">
              <span className="text-[#C58D8D]">[필수]</span> 업체 이용약관 동의
            </span>
            <Link
              href="/vendor-terms"
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-600"
            >
              보기
            </Link>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.marketing}
              onChange={(e) => setAgreements({ marketing: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
            />
            <span className="text-sm text-neutral-600">
              <span className="text-neutral-400">[선택]</span> 마케팅 정보 수신
              동의
            </span>
          </label>
        </div>
      </div>

      {/* 다음 버튼 */}
      <Button
        type="submit"
        disabled={!isFormValid}
        className="w-full h-12 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] hover:from-[#B36B6B] hover:to-[#A05A5A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
      >
        다음 단계로
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
