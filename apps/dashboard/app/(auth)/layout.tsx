import '@infiniteuny/infinity-ui/styles/globals.css';
import { APP, FONTS } from '@config';
import { AuthFooter, AuthMain } from '@app/presentation/components/auth/shared';
import { GoogleTagManager } from '@next/third-parties/google';
import { InitColorSchemeScript } from '@mui/material';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@infiniteuny/infinity-ui';
import { ReactNode } from 'react';
import { ToastProvider } from '@app/presentation/components/shared/toast-provider';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `${APP.site.title} - ${APP.site.tagline}`,
    template: `%s - ${APP.site.title}`,
  },
  description: APP.site.description,
};

export default function AuthLayout({ children }: Props) {
  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable}`}
      suppressHydrationWarning
    >
      <body id="__next">
        <InitColorSchemeScript attribute="class" modeStorageKey="theme-mode" />
        <MuiSetup>
          <SkipToContentButton />
          <AuthMain>{children}</AuthMain>
          <AuthFooter />
          <ToastProvider />
        </MuiSetup>
      </body>
      <GoogleTagManager gtmId={APP.site.gtmId} />
    </html>
  );
}
