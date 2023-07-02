import '@/presentation/styles/globals.css';
import { InternalFooter, InternalHeader } from '@/presentation/components/internal/shared';
import { MonoFont, SansFont } from '@/config';
import { MuiSetup, SkipToContentButton } from '@/presentation/components/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function InternalLayout({ children }: Props) {
  return (
    <html lang="id-ID" className={`${SansFont.variable} ${MonoFont.variable}`}>
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
