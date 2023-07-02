import '@/presentation/styles/globals.css';
import { InternalFooter, InternalHeader } from '@/presentation/components/internal/shared';
import { MonoFont, SansFont } from '@/config';
import { MuiSetup } from '@/presentation/components/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function InternalLayout({ children }: Props) {
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

          <InternalHeader />
          {children}
          <InternalFooter />
        </MuiSetup>
      </body>
    </html>
  );
}
