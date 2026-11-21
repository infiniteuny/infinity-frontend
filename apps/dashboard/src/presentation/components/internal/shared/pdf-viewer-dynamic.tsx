'use client';

import dynamic from 'next/dynamic';

export const PdfViewer = dynamic(() => import('./pdf-viewer').then((mod) => mod.PdfViewer), {
  ssr: false,
});
