/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.infiniteuny.id',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
