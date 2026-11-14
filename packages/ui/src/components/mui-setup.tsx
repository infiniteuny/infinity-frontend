'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { Theme, ThemeProvider } from '@mui/material/styles';
import { THEMES } from '../theme';

type Props = {
  children: ReactNode;
  theme?: Theme;
  modeStorageKey?: string;
};

export function MuiSetup({ children, theme = THEMES, modeStorageKey = 'theme-mode' }: Props) {
  return (
    <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
      <ThemeProvider theme={theme} modeStorageKey={modeStorageKey}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
