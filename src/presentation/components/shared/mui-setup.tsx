'use client';

import { CssBaseline } from '@mui/material';
import { LightTheme } from '@/config';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';

type Props = {
  children: ReactNode;
};

export function MuiSetup({ children }: Props) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={LightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
