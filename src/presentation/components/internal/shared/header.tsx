'use client';

import { APP } from '@config';
import { AppBar, IconButton } from '@mui/material';
import { InfiniteLogo } from '@app/presentation/components/shared';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';
import { MenuRounded } from '@mui/icons-material';
import { InternalNavbar } from './navbar';

export function InternalHeader() {
  const [sidebarOpened, setSidebarOpenedState] = useStore(
    internalStore,
    useShallow((s) => [s.sidebarOpened, s.setSidebarOpenedState]),
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
      className="flex h-18.5 w-full flex-row items-center p-4 shadow-none lg:pl-0"
    >
      <IconButton className="lg:hidden" onClick={() => setSidebarOpenedState(!sidebarOpened)}>
        <MenuRounded />
      </IconButton>
      <div className="w-full md:w-51 lg:w-65">
        <InfiniteLogo
          width={46}
          height={46}
          className="fill-infinite-light-green dark:fill-infinite-dark-green mx-auto block lg:mx-auto"
        />
      </div>
      <InternalNavbar menus={APP.internal.nav.menus} />
    </AppBar>
  );
}
