import 'reflect-metadata';
import '@/presentation/styles/globals.css';
import { Config } from '@/config';
import { Metadata } from 'next';
import { PublicFooter } from '@/presentation/components/public';
import { PublicHeader } from '@/presentation/components/public/shared/Header';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
    <html lang="id-ID" className={poppins.variable}>
      <head />
      <body>
        <a
          href="#content"
          className="absolute top-2 -left-96 z-[-99] focus:left-2 focus:z-50 active:left-2 active:z-50"
        >
          Lewati ke konten
        </a>

        <PublicHeader />
        <main id="content">{children}</main>
        <PublicFooter menus={Config.public.footer.menus} />
      </body>
    </html>
  );
}
