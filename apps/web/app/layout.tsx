import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SDM - 결혼 준비 플랫폼',
  description: '결혼 사진 시뮬레이션 및 스튜디오/메이크업/드레스 업체 매칭 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className='font-sans' lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
