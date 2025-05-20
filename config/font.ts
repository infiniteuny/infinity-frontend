import { Poppins, Source_Code_Pro } from 'next/font/google';

const sans = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

const mono = Source_Code_Pro({
  variable: '--font-source-code-pro',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Courier New', 'Courier', 'monospace'],
});

export const FONTS = { sans, mono };
