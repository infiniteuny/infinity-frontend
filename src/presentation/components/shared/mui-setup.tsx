'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { THEMES } from '@config';

type Props = {
  children: ReactNode;
};

export function MuiSetup({ children }: Props) {
  return (
    <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
      <ThemeProvider theme={THEMES}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
