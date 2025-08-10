'use client';

import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';
import { NavbarDropdownMenu } from './navbar-dropdown-menu';
import { NavbarMenu } from './navbar-menu';
import { Logout } from '@mui/icons-material';
import { useState } from 'react';

type Props = {
  menus?: Required<
    PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
  >[];
};

export function InternalNavbar({ menus }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    // logout();
  };

  return (
    <nav className="flex flex-grow items-center justify-end md:ml-4">
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
          className="w-8 h-8"
        />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            className:
              'max-w-[300px] mt-3 overflow-visible drop-shadow-md before:content-[""] before:block before:absolute before:top-0 before:right-3.5 before:w-2.5 before:h-2.5 before:-translate-y-1/2 before:rotate-45 before:z-0',
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
        {/* <Typography className="px-4 pb-2">{session?.user?.name || 'User'}</Typography> */}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </nav>
  );
}
