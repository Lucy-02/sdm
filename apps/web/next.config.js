/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sdm/types', '@sdm/config'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // /api/auth/* 제외 - Better Auth가 Next.js에서 직접 처리
        source: '/api/:path((?!auth).*)',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
