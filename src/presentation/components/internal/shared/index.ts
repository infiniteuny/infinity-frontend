'use client';

import dynamic from 'next/dynamic';

export * from './empty-row-overlay';
export * from './footer';
export * from './header';
export * from './main';
export * from './section-header';
export * from './sidebar';

export const PdfViewer = dynamic(() => import('./pdf-viewer.js').then((mod) => mod.PdfViewer), {
  ssr: false,
});
