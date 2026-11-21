'use client';

import type { CSSProperties } from 'react';
import { CloseRounded } from '@mui/icons-material';
import { CircularProgress, IconButton, useTheme } from '@mui/material';
import { Slide, ToastContainer, type IconProps } from 'react-toastify';

function renderToastIcon({ isLoading }: IconProps) {
  if (isLoading) {
    return <CircularProgress size={18} color="inherit" />;
  }

  return null;
}

export function ToastProvider() {
  const theme = useTheme();
  const containerBg = theme.vars?.palette.inverseSurface.main ?? theme.palette.inverseSurface.main;
  const containerText =
    theme.vars?.palette.inverseOnSurface.main ?? theme.palette.inverseOnSurface.main;

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={4000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      pauseOnHover
      pauseOnFocusLoss
      draggable
      limit={3}
      transition={Slide}
      icon={renderToastIcon}
      closeButton={({ closeToast }) => (
        <IconButton
          size="small"
          color="inherit"
          aria-label="Close notification"
          onClick={closeToast}
          sx={{
            color: containerText,
            p: '6px',
            ml: 1,
            flexShrink: 0,
          }}
        >
          <CloseRounded sx={{ fontSize: 20 }} />
        </IconButton>
      )}
      toastStyle={{
        background: containerBg,
        color: containerText,
        minHeight: 48,
        padding: '6px 8px 6px 16px',
        borderRadius: 4,
        boxShadow: theme.shadows[6],
        width: 'auto',
        minWidth: 'min(288px, calc(100vw - 32px))',
        maxWidth: 'min(568px, calc(100vw - 32px))',
        justifyContent: 'space-between',
        gap: 8,
        fontFamily: 'var(--font-poppins), sans-serif',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: 400,
        letterSpacing: '0.25px',
      }}
      style={
        {
          zIndex: 1500,
          '--toastify-color-light': containerBg,
          '--toastify-color-dark': containerBg,
          '--toastify-text-color-light': containerText,
          '--toastify-text-color-dark': containerText,
          '--toastify-toast-background': containerBg,
          '--toastify-toast-min-height': '48px',
          '--toastify-toast-padding': '6px 8px 6px 16px',
          '--toastify-toast-bd-radius': '4px',
          '--toastify-toast-width': 'auto',
        } as CSSProperties
      }
    />
  );
}
