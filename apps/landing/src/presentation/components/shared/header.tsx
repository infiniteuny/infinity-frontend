'use client';

import NextLink from 'next/link';
import { APP } from '@config';
import { AppBar, IconButton, Link, Toolbar } from '@mui/material';
import { InfiniteTextLogo } from '@infiniteuny/infinity-ui';
import { MenuRounded } from '@mui/icons-material';
import { Navbar } from './navbar';
import { SessionDto } from '@infiniteuny/infinity-infrastructure';
import { useState } from 'react';

type Props = {
  session?: SessionDto;
};

export function Header({ session }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

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
      className="sticky flex h-18.5 w-full flex-row items-center shadow-none transition-none"
    >
      <Toolbar className="flex w-full flex-row items-center justify-between px-4 sm:px-6">
        <IconButton
          onClick={handleToggleDrawer}
          aria-label="Open navigation menu"
          className="md:hidden"
        >
          <MenuRounded />
        </IconButton>
        <Link
          component={NextLink}
          href="/"
          underline="none"
          aria-label="INFINITE UNY Home"
          className="inline-flex items-center"
        >
          <InfiniteTextLogo
            width={150}
            height={46}
            className="fill-infinite-light-green dark:fill-infinite-dark-green block"
          />
        </Link>
        <Navbar
          menus={APP.nav.menus}
          session={session}
          mobileOpen={mobileOpen}
          onToggleDrawer={handleToggleDrawer}
        />
      </Toolbar>
    </AppBar>
  );
}
