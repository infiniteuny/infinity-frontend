import '@/presentation/styles/globals.css';
import { AuthFooter } from '@/presentation/components/auth/shared';
import { MonoFont, SansFont } from '@/config';
import { MuiSetup } from '@/presentation/components/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <html lang="id-ID" className={`${SansFont.variable} ${MonoFont.variable}`}>
      <body id="__next">
        <MuiSetup>
          <main>{children}</main>
          <AuthFooter />
        </MuiSetup>
      </body>
    </html>
  );
}
