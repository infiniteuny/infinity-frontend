import '@infiniteuny/infinity-ui/styles/globals.css';
import { APP, FONTS } from '@config';
import { InitColorSchemeScript } from '@mui/material';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@infiniteuny/infinity-ui';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `${APP.site.title} - ${APP.site.tagline}`,
    template: `%s - ${APP.site.title}`,
  },
  description: APP.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable}`}
      suppressHydrationWarning
    >
      <body id="__next" className="bg-(--m3-palette-surfaceContainer-main)">
        <InitColorSchemeScript attribute="class" />
        <MuiSetup>
          <SkipToContentButton />
          {children}
        </MuiSetup>
      </body>
    </html>
  );
}
