import '@app/presentation/styles/globals.css';
import { APP, FONTS } from '@config';
import { InitColorSchemeScript } from '@mui/material';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton } from '@app/presentation/components/shared';
import { PublicFooter, PublicHeader } from '@app/presentation/components/public/shared';
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

export default function PublicLayout({ children }: Props) {
  return (
    <html
      lang={APP.site.locale}
      className={`${FONTS.sans.variable} ${FONTS.mono.variable}`}
      suppressHydrationWarning
    >
      <body id="__next">
        <MuiSetup>
          <InitColorSchemeScript attribute="class" />
          <SkipToContentButton />
          <PublicHeader />
          <main id="content">{children}</main>
          <PublicFooter menus={APP.public.footer.menus} />
        </MuiSetup>
      </body>
    </html>
  );
}
