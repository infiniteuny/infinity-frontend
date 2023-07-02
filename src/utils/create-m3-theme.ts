import { alpha, darken, lighten } from '@mui/system';
import { deepmerge } from '@mui/utils';
import { Components, Theme, ThemeOptions, createTheme } from '@mui/material/styles';

export interface M3Tone {
  0: string;
  4: string;
  5: string;
  6: string;
  10: string;
  12: string;
  17: string;
  20: string;
  22: string;
  24: string;
  25: string;
  30: string;
  35: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  87: string;
  90: string;
  92: string;
  94: string;
  95: string;
  96: string;
  98: string;
  99: string;
  100: string;
}

export interface M3ColorTones {
  primary: M3Tone;
  secondary: M3Tone;
  tertiary: M3Tone;
  neutral: M3Tone;
  neutralVariant: M3Tone;
  error: M3Tone;
}

export type M3ThemeMode = 'dark' | 'light';

export interface M3ColorScheme {
  primary: string;
  onPrimary: string;

  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;

  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;

  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;

  errorContainer: string;
  onErrorContainer: string;

  background: string;
  onBackground: string;

  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  onSurface: string;

  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  surfaceVariant: string;
  onSurfaceVariant: string;

  inversePrimary: string;
  inverseSurface: string;
  inverseOnSurface: string;

  outline: string;
  outlineVariant: string;
  shadow: string;
}

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

export function createM3Theme({
  mode,
  tones,
  scheme,
  themeOptions,
}: {
  mode: M3ThemeMode;
  tones: M3ColorTones;
  scheme?: M3ColorScheme;
  themeOptions?: ThemeOptions;
}): Theme {
  scheme = {
    primary: scheme?.primary || (mode === 'light' ? tones.primary[40] : tones.primary[80]),
    onPrimary: scheme?.onPrimary || (mode === 'light' ? tones.primary[100] : tones.primary[20]),
    primaryContainer:
      scheme?.primaryContainer || (mode === 'light' ? tones.primary[90] : tones.primary[30]),
    onPrimaryContainer:
      scheme?.onPrimaryContainer || (mode === 'light' ? tones.primary[10] : tones.primary[90]),
    secondary: scheme?.secondary || (mode === 'light' ? tones.secondary[40] : tones.secondary[80]),
    onSecondary:
      scheme?.onSecondary || (mode === 'light' ? tones.secondary[100] : tones.secondary[20]),
    secondaryContainer:
      scheme?.secondaryContainer || (mode === 'light' ? tones.secondary[90] : tones.secondary[30]),
    onSecondaryContainer:
      scheme?.onSecondaryContainer ||
      (mode === 'light' ? tones.secondary[10] : tones.secondary[90]),
    tertiary: scheme?.tertiary || (mode === 'light' ? tones.tertiary[40] : tones.tertiary[80]),
    onTertiary: scheme?.onTertiary || (mode === 'light' ? tones.tertiary[100] : tones.tertiary[20]),
    tertiaryContainer:
      scheme?.tertiaryContainer || (mode === 'light' ? tones.tertiary[90] : tones.tertiary[30]),
    onTertiaryContainer:
      scheme?.onTertiaryContainer || (mode === 'light' ? tones.tertiary[10] : tones.tertiary[90]),
    error: scheme?.error || (mode === 'light' ? tones.error[40] : tones.error[80]),
    onError: scheme?.onError || (mode === 'light' ? tones.error[100] : tones.error[20]),
    errorContainer:
      scheme?.errorContainer || (mode === 'light' ? tones.error[90] : tones.error[30]),
    onErrorContainer:
      scheme?.onErrorContainer || (mode === 'light' ? tones.error[10] : tones.error[90]),
    background: scheme?.background || (mode === 'light' ? tones.neutral[98] : tones.neutral[6]),
    onBackground:
      scheme?.onBackground || (mode === 'light' ? tones.neutral[10] : tones.neutral[90]),
    surface: scheme?.surface || (mode === 'light' ? tones.neutral[98] : tones.neutral[6]),
    surfaceDim: scheme?.surfaceDim || (mode === 'light' ? tones.neutral[87] : tones.neutral[6]),
    surfaceBright:
      scheme?.surfaceBright || (mode === 'light' ? tones.neutral[98] : tones.neutral[24]),
    onSurface: scheme?.onSurface || (mode === 'light' ? tones.neutral[10] : tones.neutral[90]),
    surfaceContainerLowest:
      scheme?.surfaceContainerLowest || (mode === 'light' ? tones.neutral[100] : tones.neutral[4]),
    surfaceContainerLow:
      scheme?.surfaceContainerLow || (mode === 'light' ? tones.neutral[96] : tones.neutral[10]),
    surfaceContainer:
      scheme?.surfaceContainer || (mode === 'light' ? tones.neutral[94] : tones.neutral[12]),
    surfaceContainerHigh:
      scheme?.surfaceContainerHigh || (mode === 'light' ? tones.neutral[92] : tones.neutral[17]),
    surfaceContainerHighest:
      scheme?.surfaceContainerHighest || (mode === 'light' ? tones.neutral[90] : tones.neutral[22]),
    surfaceVariant:
      scheme?.surfaceVariant ||
      (mode === 'light' ? tones.neutralVariant[90] : tones.neutralVariant[30]),
    onSurfaceVariant:
      scheme?.onSurfaceVariant ||
      (mode === 'light' ? tones.neutralVariant[30] : tones.neutralVariant[80]),
    inversePrimary:
      scheme?.inversePrimary || (mode === 'light' ? tones.primary[80] : tones.primary[40]),
    inverseSurface:
      scheme?.inverseSurface || (mode === 'light' ? tones.neutral[20] : tones.neutral[90]),
    inverseOnSurface:
      scheme?.inverseOnSurface || (mode === 'light' ? tones.neutral[95] : tones.neutral[20]),
    outline:
      scheme?.outline || (mode === 'light' ? tones.neutralVariant[50] : tones.neutralVariant[60]),
    outlineVariant:
      scheme?.outlineVariant ||
      (mode === 'light' ? tones.neutralVariant[80] : tones.neutralVariant[30]),
    shadow: scheme?.shadow || tones.neutral[0],
  } as M3ColorScheme;

  const theme = createTheme(
    deepmerge(
      {
        palette: {
          mode,
          primary: {
            main: scheme.primary,
            contrastText: scheme.onPrimary,
          },
          onPrimary: {
            main: scheme.onPrimary,
            contrastText: scheme.primary,
          },
          primaryContainer: {
            main: scheme.primaryContainer,
            contrastText: scheme.onPrimaryContainer,
          },
          onPrimaryContainer: {
            main: scheme.onPrimaryContainer,
            contrastText: scheme.primaryContainer,
          },
          secondary: {
            main: scheme.secondary,
            contrastText: scheme.onSecondary,
          },
          onSecondary: {
            main: scheme.onSecondary,
            contrastText: scheme.secondary,
          },
          secondaryContainer: {
            main: scheme.secondaryContainer,
            contrastText: scheme.onSecondaryContainer,
          },
          onSecondaryContainer: {
            main: scheme.onSecondaryContainer,
            contrastText: scheme.secondaryContainer,
          },
          tertiary: {
            main: scheme.tertiary,
            contrastText: scheme.onTertiary,
          },
          onTertiary: {
            main: scheme.onTertiary,
            contrastText: scheme.tertiary,
          },
          tertiaryContainer: {
            main: scheme.tertiaryContainer,
            contrastText: scheme.onTertiaryContainer,
          },
          onTertiaryContainer: {
            main: scheme.onTertiaryContainer,
            contrastText: scheme.tertiaryContainer,
          },
          error: {
            main: scheme.error,
            contrastText: scheme.onError,
          },
          onError: {
            main: scheme.onError,
            contrastText: scheme.error,
          },
          errorContainer: {
            main: scheme.errorContainer,
            contrastText: scheme.onErrorContainer,
          },
          onErrorContainer: {
            main: scheme.onErrorContainer,
            contrastText: scheme.errorContainer,
          },
          background2: {
            main: scheme.background,
            contrastText: scheme.onBackground,
          },
          onBackground: {
            main: scheme.onBackground,
            contrastText: scheme.background,
          },
          surface: {
            main: scheme.surface,
            contrastText: scheme.onSurface,
          },
          surfaceDim: {
            main: scheme.surfaceDim,
            contrastText: scheme.onSurface,
          },
          surfaceBright: {
            main: scheme.surfaceBright,
            contrastText: scheme.onSurface,
          },
          onSurface: {
            main: scheme.onSurface,
            contrastText: scheme.surface,
          },
          surfaceContainerLowest: {
            main: scheme.surfaceContainerLowest,
            contrastText: scheme.onSurface,
          },
          surfaceContainerLow: {
            main: scheme.surfaceContainerLow,
            contrastText: scheme.onSurface,
          },
          surfaceContainer: {
            main: scheme.surfaceContainer,
            contrastText: scheme.onSurface,
          },
          surfaceContainerHigh: {
            main: scheme.surfaceContainerHigh,
            contrastText: scheme.onSurface,
          },
          surfaceContainerHighest: {
            main: scheme.surfaceContainerHighest,
            contrastText: scheme.onSurface,
          },
          surfaceVariant: {
            main: scheme.surfaceVariant,
            contrastText: scheme.onSurfaceVariant,
          },
          onSurfaceVariant: {
            main: scheme.onSurfaceVariant,
            contrastText: scheme.surfaceVariant,
          },
          inverseSurface: {
            main: scheme.inverseSurface,
            contrastText: scheme.inverseOnSurface,
          },
          inverseOnSurface: {
            main: scheme.inverseOnSurface,
            contrastText: scheme.inverseSurface,
          },
          inversePrimary: {
            main: scheme.inversePrimary,
            contrastText: scheme.primary,
          },
          outline: scheme.outline,
          outlineVariant: scheme.outlineVariant,
          shadow: scheme.shadow,
          background: {
            default: scheme.background,
            paper: scheme.surface,
          },
          common: {
            white: scheme.background,
            black: scheme.onBackground,
          },
          text: {
            primary: scheme.onSurface,
            secondary: scheme.onSecondaryContainer,
          },
          divider: scheme.outlineVariant,
        },
        tones,
      } as ThemeOptions,
      themeOptions,
    ),
  );

  return deepmerge(theme, {
    components: {
      MuiCssBaseline: {
        defaultProps: {
          enableColorScheme: true,
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.outlineVariant,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            margin: '0 16px',
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: theme.palette.surface.main,
            color: theme.palette.onSurface.main,
            transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
              duration: theme.transitions.duration.short,
            }),
          },
          colorDefault: {
            background: theme.palette.surface.main,
            color: theme.palette.onSurface.main,
            transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
              duration: theme.transitions.duration.short,
            }),
          },
          colorPrimary: {
            background:
              theme.palette.mode == 'light'
                ? lighten(theme.palette.primary.main, 0.85)
                : darken(theme.palette.primary.main, 0.8),
            color: theme.palette.surface.contrastText,
            transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
              duration: theme.transitions.duration.short,
            }),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 'bold',
          },
          outlined: {
            borderColor: theme.palette.outline,
          },
        },
        variants: [
          {
            props: { variant: 'elevated' },
            style: {
              boxShadow: theme.shadows[1],
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.15),
              },
            },
          },
          {
            props: { variant: 'filled' },
            style: {
              background: theme.palette.primary.main,
              color: theme.palette.onPrimary.main,
              '&:hover': {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.primary.main, 0.85),
              },
            },
          },
          {
            props: { variant: 'tonal' },
            style: {
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              '&:hover': {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.secondaryContainer.main, 0.8),
              },
            },
          },
        ],
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: '18px',
          },
        },
        variants: [
          {
            props: { variant: 'primary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.primaryContainer.main,
              color: theme.palette.onPrimaryContainer.main,
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.primaryContainer.main, 0.08)
                    : darken(theme.palette.primaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'extended', color: 'primary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.primaryContainer.main,
              color: theme.palette.onPrimaryContainer.main,
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.primaryContainer.main, 0.08)
                    : darken(theme.palette.primaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'secondary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.secondaryContainer.main, 0.08)
                    : darken(theme.palette.secondaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'extended', color: 'secondary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.secondaryContainer.main, 0.08)
                    : darken(theme.palette.secondaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'tertiary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.tertiaryContainer.main,
              color: theme.palette.onTertiaryContainer.main,
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.tertiaryContainer.main, 0.08)
                    : darken(theme.palette.tertiaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'extended', color: 'tertiary' },
            style: {
              boxShadow: theme.shadows[3],
              background: theme.palette.tertiaryContainer.main,
              color: theme.palette.onTertiaryContainer.main,
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.shadows[4],
                background:
                  theme.palette.mode === 'dark'
                    ? lighten(theme.palette.tertiaryContainer.main, 0.08)
                    : darken(theme.palette.tertiaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'surface' },
            style: {
              boxShadow: theme.shadows[3],
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              '&:hover': {
                boxShadow: theme.shadows[4],
                background: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'extended', color: 'surface' },
            style: {
              boxShadow: theme.shadows[3],
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.shadows[4],
                background: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
        ],
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            padding: '10px 8px',
          },
        },
        variants: [
          {
            props: { variant: 'elevation' },
            style: {
              boxShadow: theme.shadows[1],
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              transition: theme.transitions.create(
                ['background-color', 'box-shadow', 'border-color', 'color'],
                {
                  duration: theme.transitions.duration.short,
                },
              ),
              '&:hover': {
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
          {
            props: { variant: 'filled' },
            style: {
              backgroundColor: theme.palette.surfaceVariant.main,
              transition: theme.transitions.create(
                ['background-color', 'box-shadow', 'border-color', 'color'],
                {
                  duration: theme.transitions.duration.short,
                },
              ),
              '&:hover': {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.surfaceVariant.main, 0.8),
              },
            },
          },
          {
            props: { variant: 'outlined' },
            style: {
              backgroundColor: theme.palette.surface.main,
              borderColor: theme.palette.outline,
              transition: theme.transitions.create(
                ['background-color', 'box-shadow', 'border-color', 'color'],
                {
                  duration: theme.transitions.duration.short,
                },
              ),
              '&:hover': {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.onSurface.main, 0.05),
              },
            },
          },
        ],
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background:
              theme.palette.mode === 'dark'
                ? darken(theme.palette.primary.main, 0.9)
                : lighten(theme.palette.primary.main, 0.9),
            color: theme.palette.onSurface.main,
          },
          outlined: {
            borderColor: theme.palette.outline,
            background: theme.palette.surface.main,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: '0px',
            background: theme.palette.surface.main,
            color: theme.palette.onSurface.main,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: 1,
            paddingBottom: 1,
            '& .MuiListItemButton-root': {
              paddingTop: 8,
              paddingBottom: 8,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            '&.Mui-selected': {
              color: theme.palette.onSecondaryContainer.main,
              background: theme.palette.secondaryContainer.main,
              '& > .MuiListItemText-root > .MuiTypography-root': {
                fontWeight: 'bold',
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 32,
            '&.Mui-selected': {
              fontWeight: 'bold',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: theme.palette.secondaryContainer.main,
            color: theme.palette.secondaryContainer.contrastText,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            '&:before': {
              backgroundColor: theme.palette.surfaceVariant.main,
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.inverseOnSurface.main,
              color: theme.palette.inverseSurface.main,
            },
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.inverseSurface.main,
          },
          message: {
            color: theme.palette.inverseOnSurface.main,
          },
          action: {
            color: theme.palette.inversePrimary.main,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
            marginLeft: 12,
            marginRight: 8,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: 7,
              transitionDuration: '100ms',
              '&.Mui-checked': {
                transform: 'translateX(16px)',
                margin: 4,
                '& + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                  opacity: 1,
                  border: 0,
                },
                '& .MuiSwitch-thumb': {
                  color: theme.palette.onPrimary.main,
                  width: 18,
                  height: 18,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                  backgroundColor: alpha(theme.palette.onSurface.main, 0.1),
                },
                '&.Mui-disabled .MuiSwitch-thumb': {
                  color: alpha(theme.palette.surface.main, 0.8),
                },
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: theme.palette.primary.main,
                border: `6px solid ${theme.palette.primary.contrastText}`,
              },
              '&.Mui-disabled .MuiSwitch-thumb': {
                color: alpha(theme.palette.onSurface.main, 0.3),
              },
            },
            '& .MuiSwitch-thumb': {
              boxSizing: 'border-box',
              color: theme.palette.outline,
              width: 12,
              height: 12,
              '&:before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              },
            },
            '& .MuiSwitch-track': {
              borderRadius: 26 / 2,
              border: `1px solid ${theme.palette.outline}`,
              backgroundColor: theme.palette.surfaceVariant.main,
              opacity: 1,
              transition: theme.transitions.create(['background-color'], {
                duration: 500,
              }),
            },
          },
        },
      },
    } as Components,
  });
}
