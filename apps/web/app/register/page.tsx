'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleSingleAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked };
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 백엔드 연결 시 회원가입 로직 구현
    console.log('Register:', { formData, agreements });
  };

  // 비밀번호 유효성 검사
  const passwordValidation = {
    length: formData.password.length >= 8,
    letter: /[a-zA-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.confirmPassword !== '',
  };

  const isPasswordValid = passwordValidation.length && passwordValidation.letter && passwordValidation.number;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">회원가입</h1>
          <p className="text-neutral-500 text-sm">
            SDM과 함께 특별한 웨딩을 준비하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* 전화번호 입력 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                휴대폰 번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* 비밀번호 조건 */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.length ? 'text-green-600' : 'text-neutral-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>8자 이상</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.letter ? 'text-green-600' : 'text-neutral-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>영문 포함</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordValidation.number ? 'text-green-600' : 'text-neutral-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>숫자 포함</span>
                  </div>
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all ${
                    formData.confirmPassword && !passwordValidation.match
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
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordValidation.match && (
                <p className="mt-1.5 text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
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
                  onChange={(e) => handleAllAgreement(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
                />
                <span className="text-sm font-semibold text-neutral-800">전체 동의</span>
              </label>

              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => handleSingleAgreement('terms', e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
                  />
                  <span className="text-sm text-neutral-600">
                    <span className="text-[#C58D8D]">[필수]</span> 이용약관 동의
                  </span>
                  <Link href="/terms" className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">
                    보기
                  </Link>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => handleSingleAgreement('privacy', e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
                  />
                  <span className="text-sm text-neutral-600">
                    <span className="text-[#C58D8D]">[필수]</span> 개인정보 처리방침 동의
                  </span>
                  <Link href="/privacy" className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">
                    보기
                  </Link>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={(e) => handleSingleAgreement('marketing', e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
                  />
                  <span className="text-sm text-neutral-600">
                    <span className="text-neutral-400">[선택]</span> 마케팅 정보 수신 동의
                  </span>
                </label>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              disabled={!agreements.terms || !agreements.privacy || !isPasswordValid || !passwordValidation.match}
              className="w-full h-12 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] hover:from-[#B36B6B] hover:to-[#A05A5A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              가입하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-neutral-400">또는</span>
            </div>
          </div>

          {/* 소셜 회원가입 */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 가입하기
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 bg-[#FEE500] rounded-xl text-sm font-medium text-[#000000] hover:bg-[#FDD800] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M12 3c-5.52 0-10 3.58-10 8 0 2.84 1.89 5.33 4.72 6.73-.21.78-.78 2.84-.9 3.28-.14.54.2.53.42.38.17-.12 2.73-1.85 3.83-2.6.62.09 1.27.14 1.93.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                />
              </svg>
              카카오로 가입하기
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 bg-[#03C75A] rounded-xl text-sm font-medium text-white hover:bg-[#02B150] transition-colors"
            >
              <span className="font-bold text-lg">N</span>
              네이버로 가입하기
            </button>
          </div>
        </div>

        {/* 로그인 링크 */}
        <p className="text-center mt-6 text-sm text-neutral-600">
          이미 회원이신가요?{' '}
          <Link
            href="/login"
            className="text-[#C58D8D] hover:text-[#B36B6B] font-semibold transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
