/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['id-ID'],
    defaultLocale: 'id-ID',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.infiniteuny.id',
      },
    ],
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  experimental: {
    appDir: true,
  },
};
