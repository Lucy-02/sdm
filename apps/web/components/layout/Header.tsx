'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Camera,
  Sparkles,
  Palette,
  Building2,
  Shirt,
  LogOut,
  Settings,
  Loader2,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

const categories = [
  { name: '스튜디오', slug: 'studio', icon: Camera, color: 'text-[#8E808A]' },
  { name: '드레스', slug: 'dress', icon: Sparkles, color: 'text-[#B36B6B]' },
  { name: '메이크업', slug: 'makeup', icon: Palette, color: 'text-[#AF9A9D]' },
  { name: '예식장', slug: 'wedding-hall', icon: Building2, color: 'text-[#9B8B7A]' },
  { name: '한복', slug: 'hanbok', icon: Shirt, color: 'text-[#7A9B8B]' },
];

export default function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-neutral-800">SDM</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="업체명으로 검색"
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onBlur={() => setTimeout(() => setIsCategoryOpen(false), 150)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
              >
                업체 찾기
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/vendors"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-neutral-400">•</span>
                    전체 보기
                  </Link>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Link
                        key={category.slug}
                        href={`/vendors?category=${category.slug}`}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Icon className={`w-5 h-5 ${category.color}`} />
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/simulator"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
            >
              시뮬레이터
            </Link>

            <Link
              href="/my-results"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
            >
              내 결과
            </Link>
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/favorites"
              className="p-2 text-neutral-600 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
              title="찜 목록"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {isPending ? (
              <div className="p-2">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 150)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name || '사용자'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-800 truncate">{session.user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      내 정보
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#C58D8D] hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                로그인
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="업체명으로 검색"
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3 py-2">
              업체 찾기
            </div>
            <Link
              href="/vendors"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              전체 보기
            </Link>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  href={`/vendors?category=${category.slug}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  {category.name}
                </Link>
              );
            })}

            <div className="border-t border-neutral-200 my-2" />

            <Link
              href="/simulator"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              시뮬레이터
            </Link>
            <Link
              href="/my-results"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              내 결과
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-5 h-5" />
              찜 목록
            </Link>

            <div className="border-t border-neutral-200 my-2" />

            {session ? (
              <>
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{session.user.name}</p>
                      <p className="text-xs text-neutral-500">{session.user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  내 정보
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#C58D8D] hover:bg-neutral-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                로그인 / 회원가입
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
