'use client';

import { Config } from '@/config';
import { InfiniteLogoText } from '@/presentation/components/shared';
import { useCallback, useEffect } from 'react';
import { PublicNavbar } from '.';
import { publicStore, useStore } from '@/presentation/hooks';

export function PublicHeader() {
  const [headerExpanded, setHeaderExpandedState] = useStore(publicStore, (s) => [
    s.headerExpanded,
    s.setHeaderExpandedState,
  ]);

  const handleScroll = useCallback(
    () => setHeaderExpandedState(window.pageYOffset < 20),
    [setHeaderExpandedState],
  );

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <header
      className={`flex items-center justify-between fixed top-0 w-full px-6 py-4 z-10 transition-all duration-300 ${
        headerExpanded ? 'h-24 bg-transparent' : 'h-[74px] bg-[#3c7c60] shadow-md'
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto transition-all">
        <InfiniteLogoText
          width={headerExpanded ? 180 : 128}
          height={headerExpanded ? 65 : 46}
          className="transition-all duration-300"
        />
        <PublicNavbar menus={Config.public.nav.menus} />
      </div>
    </header>
  );
}
