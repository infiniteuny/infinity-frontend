import '@app/presentation/styles/globals.css';
import { APP, FONTS } from '@config';
import { InternalFooter, InternalHeader } from '@app/presentation/components/internal/shared';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@app/presentation/components/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `Dashboard - ${APP.site.title}`,
    template: `%s - ${APP.site.title}`,
  },
  description: APP.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function InternalLayout({ children }: Props) {
  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable} bg-(--m3-palette-surfaceContainer-main)`}
      suppressHydrationWarning
    >
      <body id="__next">
        <MuiSetup>
          <SkipToContentButton />
          <InternalHeader />
          {children}
          <InternalFooter />
        </MuiSetup>
      </body>
    </html>
  );
}
