'use client';

import { internalStore, useStore } from '@/presentation/hooks';

export function InternalFooter() {
  const sidebarExtended = useStore(internalStore, (s) => s.sidebarExtended);

  return (
    <footer className={`flex items-center h-12 ${sidebarExtended ? 'lg:ml-[260px]' : 'lg:ml-14'}`}>
      <p className="max-w-2xl mx-auto text-slate-400 text-sm text-center font-mono">
        Made with &#128154; by INFINITE UNY. &copy; {new Date().getFullYear()} INFINITE UNY.
      </p>
    </footer>
  );
}
