import { alpha, darken, lighten } from '@mui/system';
import { Components, Theme, ThemeOptions, createTheme } from '@mui/material/styles';
import { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';
import { deepmerge } from '@mui/utils';

export interface M3Tone {
  0: string;
  5: string;
  10: string;
  15: string;
  20: string;
  25: string;
  30: string;
  35: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  98: string;
  99: string;
  100: string;
}

export interface M3ColorTones {
  primary: M3Tone;
  secondary: M3Tone;
  tertiary: M3Tone;
  neutral: M3Tone & {
    4: string;
    6: string;
    12: string;
    17: string;
    22: string;
    24: string;
    87: string;
    92: string;
    94: string;
    96: string;
  };
  neutralVariant: M3Tone;
  error: M3Tone;
}

export function createM3Theme({
  tones,
  themeOptions,
}: {
  tones: M3ColorTones;
  themeOptions?: ThemeOptions;
}): Theme {
  const theme = createTheme(
    deepmerge(
      {
        cssVariables: {
          colorSchemeSelector: 'class',
        },
        colorSchemes: {
          light: {
            palette: {
              mode: 'light',
              primary: {
                main: tones.primary[40],
                contrastText: tones.primary[100],
              },
              onPrimary: {
                main: tones.primary[100],
                contrastText: tones.primary[40],
              },
              primaryContainer: {
                main: tones.primary[90],
                contrastText: tones.primary[30],
              },
              onPrimaryContainer: {
                main: tones.primary[30],
                contrastText: tones.primary[90],
              },
              secondary: {
                main: tones.secondary[40],
                contrastText: tones.secondary[100],
              },
              onSecondary: {
                main: tones.secondary[100],
                contrastText: tones.secondary[40],
              },
              secondaryContainer: {
                main: tones.secondary[90],
                contrastText: tones.secondary[30],
              },
              onSecondaryContainer: {
                main: tones.secondary[30],
                contrastText: tones.secondary[90],
              },
              tertiary: {
                main: tones.tertiary[40],
                contrastText: tones.tertiary[100],
              },
              onTertiary: {
                main: tones.tertiary[100],
                contrastText: tones.tertiary[40],
              },
              tertiaryContainer: {
                main: tones.tertiary[90],
                contrastText: tones.tertiary[30],
              },
              onTertiaryContainer: {
                main: tones.tertiary[30],
                contrastText: tones.tertiary[90],
              },
              error: {
                main: tones.error[40],
                contrastText: tones.error[100],
              },
              onError: {
                main: tones.error[100],
                contrastText: tones.error[40],
              },
              errorContainer: {
                main: tones.error[90],
                contrastText: tones.error[30],
              },
              onErrorContainer: {
                main: tones.error[30],
                contrastText: tones.error[90],
              },
              background2: {
                main: tones.neutral[98],
                contrastText: tones.neutral[10],
              },
              onBackground: {
                main: tones.neutral[10],
                contrastText: tones.neutral[98],
              },
              surface: {
                main: tones.neutral[98],
                contrastText: tones.neutral[10],
              },
              surfaceDim: {
                main: tones.neutral[87],
                contrastText: tones.neutral[10],
              },
              surfaceBright: {
                main: tones.neutral[98],
                contrastText: tones.neutral[10],
              },
              onSurface: {
                main: tones.neutral[10],
                contrastText: tones.neutral[98],
              },
              surfaceContainerLowest: {
                main: tones.neutral[100],
                contrastText: tones.neutral[10],
              },
              surfaceContainerLow: {
                main: tones.neutral[96],
                contrastText: tones.neutral[10],
              },
              surfaceContainer: {
                main: tones.neutral[94],
                contrastText: tones.neutral[10],
              },
              surfaceContainerHigh: {
                main: tones.neutral[92],
                contrastText: tones.neutral[10],
              },
              surfaceContainerHighest: {
                main: tones.neutral[90],
                contrastText: tones.neutral[10],
              },
              surfaceVariant: {
                main: tones.neutralVariant[90],
                contrastText: tones.neutralVariant[30],
              },
              onSurfaceVariant: {
                main: tones.neutralVariant[30],
                contrastText: tones.neutralVariant[90],
              },
              inverseSurface: {
                main: tones.neutral[20],
                contrastText: tones.neutral[95],
              },
              inverseOnSurface: {
                main: tones.neutral[95],
                contrastText: tones.neutral[20],
              },
              inversePrimary: {
                main: tones.primary[80],
                contrastText: tones.primary[40],
              },
              outline: tones.neutralVariant[50],
              outlineVariant: tones.neutralVariant[80],
              shadow: tones.neutral[0],
              background: {
                default: tones.neutral[98],
                paper: tones.neutral[98],
              },
              common: {
                white: tones.neutral[98],
                black: tones.neutral[10],
              },
              text: {
                primary: tones.neutral[10],
                secondary: tones.secondary[30],
              },
              divider: tones.neutralVariant[80],
              DataGrid: {
                bg: tones.neutral[98],
                headerBg: tones.neutral[98],
                pinnedBg: tones.neutral[98],
              },
            },
          },
          dark: {
            mode: 'dark',
            palette: {
              primary: {
                main: tones.primary[80],
                contrastText: tones.primary[20],
              },
              onPrimary: {
                main: tones.primary[20],
                contrastText: tones.primary[80],
              },
              primaryContainer: {
                main: tones.primary[30],
                contrastText: tones.primary[90],
              },
              onPrimaryContainer: {
                main: tones.primary[90],
                contrastText: tones.primary[30],
              },
              secondary: {
                main: tones.secondary[80],
                contrastText: tones.secondary[20],
              },
              onSecondary: {
                main: tones.secondary[20],
                contrastText: tones.secondary[80],
              },
              secondaryContainer: {
                main: tones.secondary[30],
                contrastText: tones.secondary[90],
              },
              onSecondaryContainer: {
                main: tones.secondary[90],
                contrastText: tones.secondary[30],
              },
              tertiary: {
                main: tones.tertiary[80],
                contrastText: tones.tertiary[20],
              },
              onTertiary: {
                main: tones.tertiary[20],
                contrastText: tones.tertiary[80],
              },
              tertiaryContainer: {
                main: tones.tertiary[30],
                contrastText: tones.tertiary[90],
              },
              onTertiaryContainer: {
                main: tones.tertiary[90],
                contrastText: tones.tertiary[30],
              },
              error: {
                main: tones.error[80],
                contrastText: tones.error[20],
              },
              onError: {
                main: tones.error[20],
                contrastText: tones.error[80],
              },
              errorContainer: {
                main: tones.error[30],
                contrastText: tones.error[90],
              },
              onErrorContainer: {
                main: tones.error[90],
                contrastText: tones.error[30],
              },
              background2: {
                main: tones.neutral[6],
                contrastText: tones.neutral[90],
              },
              onBackground: {
                main: tones.neutral[90],
                contrastText: tones.neutral[6],
              },
              surface: {
                main: tones.neutral[6],
                contrastText: tones.neutral[90],
              },
              surfaceDim: {
                main: tones.neutral[6],
                contrastText: tones.neutral[90],
              },
              surfaceBright: {
                main: tones.neutral[24],
                contrastText: tones.neutral[90],
              },
              onSurface: {
                main: tones.neutral[90],
                contrastText: tones.neutral[98],
              },
              surfaceContainerLowest: {
                main: tones.neutral[4],
                contrastText: tones.neutral[90],
              },
              surfaceContainerLow: {
                main: tones.neutral[10],
                contrastText: tones.neutral[90],
              },
              surfaceContainer: {
                main: tones.neutral[12],
                contrastText: tones.neutral[90],
              },
              surfaceContainerHigh: {
                main: tones.neutral[17],
                contrastText: tones.neutral[90],
              },
              surfaceContainerHighest: {
                main: tones.neutral[22],
                contrastText: tones.neutral[90],
              },
              surfaceVariant: {
                main: tones.neutralVariant[30],
                contrastText: tones.neutralVariant[80],
              },
              onSurfaceVariant: {
                main: tones.neutralVariant[80],
                contrastText: tones.neutralVariant[30],
              },
              inverseSurface: {
                main: tones.neutral[90],
                contrastText: tones.neutral[20],
              },
              inverseOnSurface: {
                main: tones.neutral[20],
                contrastText: tones.neutral[90],
              },
              inversePrimary: {
                main: tones.primary[40],
                contrastText: tones.primary[80],
              },
              outline: tones.neutralVariant[60],
              outlineVariant: tones.neutralVariant[30],
              shadow: tones.neutral[0],
              background: {
                default: tones.neutral[98],
                paper: tones.neutral[98],
              },
              common: {
                white: tones.neutral[6],
                black: tones.neutral[90],
              },
              text: {
                primary: tones.neutral[90],
                secondary: tones.secondary[90],
              },
              divider: tones.neutralVariant[30],
              DataGrid: {
                bg: tones.neutral[6],
                headerBg: tones.neutral[6],
                pinnedBg: tones.neutral[6],
              },
            },
          },
        },
      } as ThemeOptions,
      themeOptions,
    ),
  );

  return deepmerge(theme, {
    components: {
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
            color: theme.palette.surface.contrastText,
            transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
              duration: theme.transitions.duration.short,
            }),
            background: lighten(theme.palette.primary.main, 0.85),
            ...theme.applyStyles('dark', {
              background: darken(theme.palette.primary.main, 0.8),
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
          outlined: {
            borderColor: theme.palette.outline,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: '18px',
            variants: [
              {
                props: { variant: 'primary' },
                style: {
                  boxShadow: theme.shadows[3],
                  background: theme.palette.primaryContainer.main,
                  color: theme.palette.onPrimaryContainer.main,
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    background: darken(theme.palette.primaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.primaryContainer.main, 0.08),
                    }),
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
                    background: darken(theme.palette.primaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.primaryContainer.main, 0.08),
                    }),
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
                    background: darken(theme.palette.secondaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.secondaryContainer.main, 0.08),
                    }),
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
                    background: darken(theme.palette.secondaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.secondaryContainer.main, 0.08),
                    }),
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
                    background: darken(theme.palette.tertiaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.tertiaryContainer.main, 0.08),
                    }),
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
                    background: darken(theme.palette.tertiaryContainer.main, 0.08),
                    ...theme.applyStyles('dark', {
                      background: lighten(theme.palette.tertiaryContainer.main, 0.08),
                    }),
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
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            padding: '10px 8px',
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
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: lighten(theme.palette.primary.main, 0.9),
            ...theme.applyStyles('dark', {
              background: darken(theme.palette.primary.main, 0.9),
            }),
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
              '&:hover': {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.secondaryContainer.main, 0.8),
              },
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
      MuiDataGrid: {
        styleOverrides: {
          overlay: {
            backgroundColor: 'transparent',
          },
          columnHeader: {
            '& .MuiDataGrid-columnSeparator': {
              color: theme.palette.outlineVariant,
            },
          },
          panelContent: {
            background: tones.neutral[98],
            ...theme.applyStyles('dark', {
              background: tones.neutral[6],
            }),
          },
        },
      },
    } satisfies Components & DataGridComponents,
  });
}
