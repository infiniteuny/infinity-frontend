'use client';

import dynamic from 'next/dynamic';

export * from './alert-dialog';
export * from './empty-row-overlay';
export * from './footer';
export * from './header';
export * from './main';
export * from './section-header';
export * from './sidebar';
export * from './store-provider';
export * from './view-tile';

export const PdfViewer = dynamic(() => import('./pdf-viewer.js').then((mod) => mod.PdfViewer), {
  ssr: false,
});
