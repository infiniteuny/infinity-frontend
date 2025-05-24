/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
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
