'use client';

import { APP } from '@config';
import { AppBar, IconButton, useMediaQuery } from '@mui/material';
import { InfiniteLogo, InfiniteTextLogo } from '@app/presentation/components/shared';
import { InternalNavbar } from './navbar';
import { MenuRounded } from '@mui/icons-material';
import { useInternalStore } from '@app/presentation/hooks';
import { useShallow } from 'zustand/shallow';

export function InternalHeader() {
  const mediaQueryGreaterThanLg = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [sidebarExtended, sidebarHovered, sidebarOpened, setSidebarOpenedState] = useInternalStore(
    useShallow((s) => [
      s.sidebarExtended,
      s.sidebarHovered,
      s.sidebarOpened,
      s.setSidebarOpenedState,
    ]),
  );

  return (
    <AppBar
      component="header"
      sx={[
        (theme) => ({
          background: theme.vars?.palette.surfaceContainer.main,
          ...theme.applyStyles('dark', {
            background: theme.vars?.palette.surfaceContainer.main,
          }),
        }),
      ]}
      className="sticky flex h-18.5 w-full flex-row items-center p-4 shadow-none transition-none lg:pl-0"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        className="lg:hidden"
        onClick={() => setSidebarOpenedState(!sidebarOpened)}
      >
        <MenuRounded />
      </IconButton>
      <div
        className={`w-full transition-[width] md:w-51 md:pr-9 lg:pr-0 ${mediaQueryGreaterThanLg && (sidebarHovered || sidebarExtended) ? 'lg:w-65' : 'lg:w-20'}`}
      >
        {mediaQueryGreaterThanLg && sidebarExtended ? (
          <InfiniteTextLogo
            width={150}
            height={46}
            className="fill-infinite-light-green dark:fill-infinite-dark-green mx-auto block"
          />
        ) : (
          <InfiniteLogo
            width={46}
            height={46}
            className="fill-infinite-light-green dark:fill-infinite-dark-green mx-auto block"
          />
        )}
      </div>
      <InternalNavbar menus={APP.internal.nav.menus} />
    </AppBar>
  );
}
