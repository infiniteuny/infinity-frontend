import 'reflect-metadata';
import '@/presentation/styles/globals.css';
import { InternalFooter } from '@/presentation/components/internal/shared/Footer';
import { InternalHeader } from '@/presentation/components/internal/shared/Header';
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

export default function InternalLayout({ children }: Props) {
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

        <InternalHeader />
        {children}
        <InternalFooter />
      </body>
    </html>
  );
}
