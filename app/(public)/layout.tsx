import '@/presentation/styles/globals.css';
import { Config } from '@/config';
import { Metadata } from 'next';
import { MonoFont, SansFont } from '@/config';
import { MuiSetup } from '@/presentation/components/shared';
import { PublicFooter, PublicHeader } from '@/presentation/components/public/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  title: {
    default: Config.site.title + ' - ' + Config.site.tagline,
    template: '%s - ' + Config.site.title,
  },
  description: Config.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function PublicLayout({ children }: Props) {
  return (
    <html lang="id-ID" className={`${SansFont.variable} ${MonoFont.variable}`}>
      <body id="__next">
        <MuiSetup>
          <a
            href="#content"
            className="absolute top-2 -left-96 z-[-99] focus:left-2 focus:z-50 active:left-2 active:z-50"
          >
            Lewati ke konten
          </a>

          <PublicHeader />
          <main id="content">{children}</main>
          <PublicFooter menus={Config.public.footer.menus} />
        </MuiSetup>
      </body>
    </html>
  );
}
