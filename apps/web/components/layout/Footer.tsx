import Link from 'next/link';
import { Camera, Sparkles, Palette, Building2, Shirt, Mail, Phone, MapPin } from 'lucide-react';

const categories = [
  { name: '스튜디오', slug: 'studio', icon: Camera },
  { name: '드레스', slug: 'dress', icon: Sparkles },
  { name: '메이크업', slug: 'makeup', icon: Palette },
  { name: '예식장', slug: 'wedding-hall', icon: Building2 },
  { name: '한복', slug: 'hanbok', icon: Shirt },
];

const serviceLinks = [
  { name: '시뮬레이터', href: '/simulator' },
  { name: '업체 찾기', href: '/vendors' },
  { name: '내 결과', href: '/my-results' },
  { name: '찜 목록', href: '/favorites' },
];

const supportLinks = [
  { name: '자주 묻는 질문', href: '/faq' },
  { name: '공지사항', href: '/notice' },
  { name: '1:1 문의', href: '/inquiry' },
  { name: '제휴 문의', href: '/partnership' },
];

const legalLinks = [
  { name: '이용약관', href: '/terms' },
  { name: '개인정보처리방침', href: '/privacy' },
  { name: '위치기반서비스 이용약관', href: '/location-terms' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#C58D8D] to-[#B36B6B] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SDM</span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              스튜디오, 드레스, 메이크업<br />
              결혼 준비의 모든 것을 한 곳에서
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail className="w-4 h-4" />
                <span>contact@sdm.kr</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Phone className="w-4 h-4" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>서울시 강남구</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">카테고리</h3>
            <ul className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.slug}>
                    <Link
                      href={`/vendors?category=${category.slug}`}
                      className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Services & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 mb-6">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">뉴스레터 구독</h3>
            <p className="text-sm text-neutral-400 mb-3">
              웨딩 트렌드와 할인 정보를 받아보세요
            </p>
            <form className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="이메일 주소"
                className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C58D8D] hover:bg-[#B36B6B] text-white text-sm font-medium rounded-lg transition-colors"
              >
                구독
              </button>
            </form>

            <h3 className="text-white font-semibold mb-4">SNS</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Kakao"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.836 1.89 5.32 4.728 6.69-.185.683-.69 2.478-.79 2.86-.123.474.174.467.366.34.15-.1 2.39-1.623 3.36-2.28.76.112 1.545.17 2.336.17 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                </svg>
              </a>
              <a
                href="https://blog.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Naver Blog"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link href={link.href} className="hover:text-neutral-300 transition-colors">
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="text-neutral-700">|</span>}
                </span>
              ))}
            </div>

            {/* Business Info */}
            <div className="text-xs text-neutral-500 text-center md:text-right">
              <p>(주)SDM | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
              <p className="mt-1">© 2025 SDM. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
