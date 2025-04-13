import { M3ColorTones } from '@/utils/create-m3-theme';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    primary?: PaletteColorOptions;
    onPrimary?: PaletteColorOptions;

    primaryContainer?: PaletteColorOptions;
    onPrimaryContainer?: PaletteColorOptions;

    secondary?: PaletteColorOptions;
    onSecondary?: PaletteColorOptions;

    secondaryContainer?: PaletteColorOptions;
    onSecondaryContainer?: PaletteColorOptions;

    tertiary?: PaletteColorOptions;
    onTertiary?: PaletteColorOptions;

    tertiaryContainer?: PaletteColorOptions;
    onTertiaryContainer?: PaletteColorOptions;

    error?: PaletteColorOptions;
    onError?: PaletteColorOptions;

    errorContainer?: PaletteColorOptions;
    onErrorContainer?: PaletteColorOptions;

    background2?: PaletteColorOptions;
    onBackground?: PaletteColorOptions;

    surface?: PaletteColorOptions;
    surfaceDim?: PaletteColorOptions;
    surfaceBright?: PaletteColorOptions;
    onSurface?: PaletteColorOptions;

    surfaceContainerLowest?: PaletteColorOptions;
    surfaceContainerLow?: PaletteColorOptions;
    surfaceContainer?: PaletteColorOptions;
    surfaceContainerHigh?: PaletteColorOptions;
    surfaceContainerHighest?: PaletteColorOptions;

    surfaceVariant?: PaletteColorOptions;
    onSurfaceVariant?: PaletteColorOptions;

    inversePrimary?: PaletteColorOptions;
    inverseSurface?: PaletteColorOptions;
    inverseOnSurface?: PaletteColorOptions;

    outline?: string;
    outlineVariant?: string;
    shadow?: string;
  }

  interface Palette {
    primary: PaletteColor;
    onPrimary: PaletteColor;

    primaryContainer: PaletteColor;
    onPrimaryContainer: PaletteColor;

    secondary: PaletteColor;
    onSecondary: PaletteColor;

    secondaryContainer: PaletteColor;
    onSecondaryContainer: PaletteColor;

    tertiary: PaletteColor;
    onTertiary: PaletteColor;

    tertiaryContainer: PaletteColor;
    onTertiaryContainer: PaletteColor;

    error: PaletteColor;
    onError: PaletteColor;

    errorContainer: PaletteColor;
    onErrorContainer: PaletteColor;

    background2: PaletteColor;
    onBackground: PaletteColor;

    surface: PaletteColor;
    surfaceDim: PaletteColor;
    surfaceBright: PaletteColor;
    onSurface: PaletteColor;

    surfaceContainerLowest: PaletteColor;
    surfaceContainerLow: PaletteColor;
    surfaceContainer: PaletteColor;
    surfaceContainerHigh: PaletteColor;
    surfaceContainerHighest: PaletteColor;

    surfaceVariant: PaletteColor;
    onSurfaceVariant: PaletteColor;

    inversePrimary: PaletteColor;
    inverseSurface: PaletteColor;
    inverseOnSurface: PaletteColor;

    outline: string;
    outlineVariant: string;
    shadow: string;
  }
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    tones?: M3ColorTones;
  }
  interface Theme {
    tones?: M3ColorTones;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
    contained: false;
  }

  interface ButtonPropsColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    filled: true;
  }
}

declare module '@mui/material/Fab' {
  interface FabPropsVariantOverrides {
    primary: true;
    secondary: true;
    tertiary: true;
    surface: true;
  }

  interface FabPropsColorOverrides {
    tertiary: true;
    surface: true;
  }
}
