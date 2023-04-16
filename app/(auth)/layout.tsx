import 'reflect-metadata';
import '@/presentation/styles/globals.css';
import { AuthFooter } from '@/presentation/components/auth/shared';
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

export default function AuthLayout({ children }: Props) {
  return (
    <html lang="id-ID" className={poppins.variable}>
      <head />
      <body>
        <main>{children}</main>
        <AuthFooter />
      </body>
    </html>
  );
}
