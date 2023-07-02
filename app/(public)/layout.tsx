import '@/presentation/styles/globals.css';
import { Config } from '@/config';
import { Metadata } from 'next';
import { MonoFont, SansFont } from '@/config';
import { MuiSetup, SkipToContentButton } from '@/presentation/components/shared';
import { PublicFooter, PublicHeader } from '@/presentation/components/public/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `${Config.site.title} - ${Config.site.tagline}`,
    template: `%s - ${Config.site.title}`,
  },
  description: Config.site.description,
};

export default function PublicLayout({ children }: Props) {
  return (
    <html lang="id-ID" className={`${SansFont.variable} ${MonoFont.variable}`}>
      <body id="__next">
        <MuiSetup>
          <SkipToContentButton />
          <PublicHeader />
          <main id="content">{children}</main>
          <PublicFooter menus={Config.public.footer.menus} />
        </MuiSetup>
      </body>
    </html>
  );
}
