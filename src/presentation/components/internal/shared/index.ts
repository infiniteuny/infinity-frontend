'use client';

import dynamic from 'next/dynamic';

export * from './alert-dialog';
export * from './clickable-view-tile';
export * from './empty-row-overlay';
export * from './footer';
export * from './grid-operators';
export * from './header';
export * from './main';
export * from './main-container';
export * from './section-header';
export * from './sidebar';
export * from './store-provider';
export * from './view-tile';

export * from './community-group-filter-input';
export * from './competition-instance-filter-input';
export * from './competition-organizer-type-filter-input';
export * from './competition-output-filter-input';
export * from './competition-rank-filter-input';
export * from './competition-scale-filter-input';
export * from './competition-team-type-filter-input';
export * from './competition-time-range-filter-input';
export * from './core-team-division-filter-input';
export * from './degree-filter-input';
export * from './faculty-filter-input';
export * from './major-filter-input';
export * from './team-filter-input';
export * from './user-filter-input';

export const PdfViewer = dynamic(() => import('./pdf-viewer.js').then((mod) => mod.PdfViewer), {
  ssr: false,
});
