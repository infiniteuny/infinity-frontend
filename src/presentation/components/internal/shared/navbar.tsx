'use client';

import { Avatar, Button, IconButton, List, Popover, Typography } from '@mui/material';
import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';
import { NavbarDropdownMenu } from './navbar-dropdown-menu';
import { NavbarMenu } from './navbar-menu';
import { CloseRounded, LogoutRounded, PersonRounded } from '@mui/icons-material';
import { ClickableViewTile } from './clickable-view-tile';
import { useMemo, useState } from 'react';
import { clientContainer } from '@app/client-injection';
import { Logout } from '@app/application';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

type Props = {
  menus?: Required<
    PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
  >[];
};

export function InternalNavbar({ menus }: Props) {
  const logout = useMemo(() => clientContainer.get<Logout>(SYMBOLS.Logout), []);
  const router = useRouter();

  const [session] = useInternalStore(useShallow((s) => [s.session]));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout.execute();
    router.push('/login');
  };

  return (
    <nav className="flex grow items-center justify-end md:ml-4">
      <List dense={true} disablePadding={true} className="hidden text-center md:flex">
        {menus &&
          menus.map((menu, i) => {
            if (menu.hasOwnProperty('path') || menu.hasOwnProperty('url')) {
              return <NavbarMenu key={i} menu={menu as PathMenu | UrlMenu} />;
            } else {
              return <NavbarDropdownMenu key={i} menu={menu as NestedMenu} />;
            }
          })}
      </List>
      <IconButton
        onClick={handleClick}
        size="small"
        className="p-1"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          variant="circular"
          sizes="32px"
          // src={session?.user?.image || '/assets/img/profile.png'}
          alt="User"
          className="h-8 w-8"
        />
      </IconButton>
      <Popover
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        keepMounted
        marginThreshold={0}
        slotProps={{
          paper: {
            elevation: 0,
            className:
              'max-w-[100%] min-w-[200px] w-[350px] p-4 mt-3 rounded-2xl drop-shadow-md max-[450px]:flex! max-[450px]:flex-col! max-[450px]:w-full! max-[450px]:right-0! max-[450px]:left-0! max-[450px]:top-0! max-[450px]:bottom-0! max-[450px]:m-0! max-[450px]:h-screen! max-[450px]:max-h-screen! max-[450px]:rounded-none! max-[450px]:py-12! max-[450px]:px-6!',
            sx: [
              (theme) => ({
                bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                '&::before': {
                  bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                },
              }),
              (theme) =>
                theme.applyStyles('dark', {
                  bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                  '&::before': {
                    bgcolor: theme.vars?.palette.surfaceContainerHigh.main,
                  },
                }),
            ],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="h5" className="px-4 text-center">
          Hi! {session?.user.name || 'User'}
        </Typography>
        <ClickableViewTile
          title="Profile"
          position="single"
          icon={<PersonRounded />}
          href="/settings/profile"
          className="mt-6"
          sx={{ bgcolor: 'surfaceContainer.main' }}
        />
        <Button
          variant="tonal"
          fullWidth
          className="mt-4 max-[450px]:mt-auto!"
          size="large"
          startIcon={<LogoutRounded fontSize="small" />}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <IconButton
          onClick={handleClose}
          className="absolute top-2 right-2 hidden max-[450px]:block!"
          aria-label="Close"
        >
          <CloseRounded />
        </IconButton>
      </Popover>
    </nav>
  );
}
