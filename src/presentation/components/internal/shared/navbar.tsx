'use client';

import { Avatar, Button, IconButton, List, Popover, Typography } from '@mui/material';
import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';
import { NavbarDropdownMenu } from './navbar-dropdown-menu';
import { NavbarMenu } from './navbar-menu';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { SessionDto, SessionMapper } from '@app/infrastructure/dtos';
import { useMemo, useState } from 'react';
import { clientContainer } from '@app/client-injection';
import { Logout } from '@app/application';
import { SYMBOLS } from '@config';
import { useRouter } from 'next/navigation';

type Props = {
  session: SessionDto;
  menus?: Required<
    PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
  >[];
};

export function InternalNavbar({ session, menus }: Props) {
  const logout = useMemo(() => clientContainer.get<Logout>(SYMBOLS.Logout), []);
  const router = useRouter();

  const parsedSession = SessionMapper.fromDtoToDomain(session);

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
        slotProps={{
          paper: {
            elevation: 0,
            className: 'max-w-[100%] min-w-[200px] w-[350px] p-4 mt-3 rounded-2xl drop-shadow-md',
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
        <Typography typography="h5" className="px-4 text-center">
          Hi! {parsedSession.user.name || 'User'}
        </Typography>
        <Button
          variant="elevated"
          fullWidth
          className="mt-4"
          size="large"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Popover>
    </nav>
  );
}
