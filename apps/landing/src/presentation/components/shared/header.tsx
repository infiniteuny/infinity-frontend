'use client';

import NextLink from 'next/link';
import { APP } from '@config';
import { AppBar, IconButton, Link, Toolbar } from '@mui/material';
import { InfiniteTextLogo } from '@infiniteuny/infinity-ui';
import { MenuRounded } from '@mui/icons-material';
import { Navbar } from './navbar';
import { SessionDto } from '@infiniteuny/infinity-infrastructure';
import { useEffect, useState } from 'react';

type Props = {
  session?: SessionDto;
};

export function Header({ session }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <AppBar
      component="header"
      position="fixed"
      sx={[
        (theme) => ({
          background: theme.vars?.palette.surfaceContainer.main,
          ...theme.applyStyles('dark', {
            background: theme.vars?.palette.surfaceContainer.main,
          }),
        }),
      ]}
      className="fixed top-0 right-0 left-0 flex h-18.5 w-full flex-row items-center shadow-none transition-none"
    >
      <Toolbar className="flex w-full flex-row items-center justify-between px-4 sm:px-6">
        <IconButton
          onClick={handleToggleDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden"
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
