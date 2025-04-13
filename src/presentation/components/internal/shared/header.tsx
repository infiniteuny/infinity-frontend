'use client';

import { Config } from '@/config';
import { IconButton } from '@mui/material';
import { InfiniteLogo } from '@/presentation/components/shared';
import { InternalNavbar } from './navbar';
import { MenuRounded } from '@mui/icons-material';
import { internalStore, useShallow, useStore } from '@/presentation/hooks';

export function InternalHeader() {
  const [sidebarOpened, setSidebarOpenedState] = useStore(internalStore, useShallow((s) => [
    s.sidebarOpened,
    s.setSidebarOpenedState,
  ]));

  return (
    <header
      className="flex items-center fixed top-0 w-full h-[74px] p-4 z-20
    bg-white transition-all duration-300 shadow-md lg:pl-0"
    >
      <IconButton
        variant="text"
        className="!w-11 !max-w-[44px] !h-11 !max-h-11 !text-infinite-green lg:hidden"
        onClick={() => setSidebarOpenedState(!sidebarOpened)}
      >
        <MenuRounded className="!text-3xl" />
      </IconButton>
      <div className="lg:w-[260px]">
        <InfiniteLogo width={46} height={46} className="ml-8 fill-infinite-green lg:mx-auto" />
      </div>
      <InternalNavbar menus={Config.internal.nav.menus} />
    </header>
  );
}
