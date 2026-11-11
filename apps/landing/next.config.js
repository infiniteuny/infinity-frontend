/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: [
    '@infiniteuny/infinity-domain',
    '@infiniteuny/infinity-application',
    '@infiniteuny/infinity-infrastructure',
    '@infiniteuny/infinity-ui',
    '@infiniteuny/infinity-utils',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.infiniteuny.id',
      },
    ],
  },
  allowedDevOrigins: ['192.168.100.191'],
};
