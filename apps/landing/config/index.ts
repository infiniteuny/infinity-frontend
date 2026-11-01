export * from './fonts';
export * from './themes';
export { SYMBOLS } from '@infiniteuny/infinity-domain';

export const APP: {
  site: {
    url: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    locale: string;
  };
} = {
  site: {
    url: 'https://www.infiniteuny.id',
    title: 'INFINITE UNY',
    tagline: "Let's Make Infinite Technology!",
    description:
      'INFINITE (Information and Technology Community) is the official information technology community at Universitas Negeri Yogyakarta.',
    image: 'https://www.infiniteuny.id/assets/images/og-image.png',
    locale: 'id-ID',
  },
};
