'use client';

import config from 'tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { M3Tone, createM3Theme } from '@/utils';
import { SansFont } from './font';

const tailwindConfig = resolveConfig(config);

export const LightTheme = createM3Theme({
  mode: 'light',
  tones: {
    primary: tailwindConfig.theme?.colors?.primary as unknown as M3Tone,
    secondary: tailwindConfig.theme?.colors?.secondary as unknown as M3Tone,
    tertiary: tailwindConfig.theme?.colors?.tertiary as unknown as M3Tone,
    neutral: tailwindConfig.theme?.colors?.neutral as unknown as M3Tone,
    neutralVariant: tailwindConfig.theme?.colors?.['neutral-variant'] as unknown as M3Tone,
    error: tailwindConfig.theme?.colors?.error as unknown as M3Tone,
  },
  themeOptions: {
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    typography: {
      fontFamily: SansFont.style.fontFamily,
    },
    shape: {
      borderRadius: 8,
    },
  },
});

export const DarkTheme = createM3Theme({
  mode: 'dark',
  tones: {
    primary: tailwindConfig.theme?.colors?.primary as unknown as M3Tone,
    secondary: tailwindConfig.theme?.colors?.secondary as unknown as M3Tone,
    tertiary: tailwindConfig.theme?.colors?.tertiary as unknown as M3Tone,
    neutral: tailwindConfig.theme?.colors?.neutral as unknown as M3Tone,
    neutralVariant: tailwindConfig.theme?.colors?.['neutral-variant'] as unknown as M3Tone,
    error: tailwindConfig.theme?.colors?.error as unknown as M3Tone,
  },
  themeOptions: {
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    typography: {
      fontFamily: SansFont.style.fontFamily,
    },
    shape: {
      borderRadius: 8,
    },
  },
});
