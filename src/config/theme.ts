'use client';

import { createTheme } from '@mui/material/styles';
import { SansFont } from './font';

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: SansFont.style.fontFamily,
  },
});

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: SansFont.style.fontFamily,
  },
});
