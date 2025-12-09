'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        setError(result.error.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      // 로그인 성공 - callbackUrl이 있으면 해당 페이지로, 없으면 홈으로
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch (err) {
      setError('소셜 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">로그인</h1>
          <p className="text-neutral-500 text-sm">
            SDM에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* 로그인 유지 & 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#C58D8D] focus:ring-[#C58D8D] cursor-pointer"
                />
                <span className="text-sm text-neutral-600">로그인 유지</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#C58D8D] hover:text-[#B36B6B] transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#C58D8D] to-[#B36B6B] hover:from-[#B36B6B] hover:to-[#A05A5A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
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

          {/* 소셜 로그인 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
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
              Google로 계속하기
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              className="w-full flex items-center justify-center gap-3 h-12 bg-[#FEE500] rounded-xl text-sm font-medium text-[#000000] hover:bg-[#FDD800] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M12 3c-5.52 0-10 3.58-10 8 0 2.84 1.89 5.33 4.72 6.73-.21.78-.78 2.84-.9 3.28-.14.54.2.53.42.38.17-.12 2.73-1.85 3.83-2.6.62.09 1.27.14 1.93.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                />
              </svg>
              카카오로 계속하기
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('naver')}
              className="w-full flex items-center justify-center gap-3 h-12 bg-[#03C75A] rounded-xl text-sm font-medium text-white hover:bg-[#02B150] transition-colors"
            >
              <span className="font-bold text-lg">N</span>
              네이버로 계속하기
            </button>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <p className="text-center mt-6 text-sm text-neutral-600">
          아직 회원이 아니신가요?{' '}
          <Link
            href="/register"
            className="text-[#C58D8D] hover:text-[#B36B6B] font-semibold transition-colors"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
