'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import { THEME } from '@config';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';

type Props = {
  children: ReactNode;
};

export function MuiSetup({ children }: Props) {
  return (
    <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
      <ThemeProvider theme={THEME}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
