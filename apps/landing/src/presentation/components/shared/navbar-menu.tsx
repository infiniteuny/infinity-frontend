'use client';

import Link from 'next/link';
import { Icon } from '@infiniteuny/infinity-ui';
import { PathMenu, UrlMenu } from '@infiniteuny/infinity-domain';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

type Props = {
  menu: PathMenu | UrlMenu;
};

export function NavbarMenu({ menu }: Props) {
  const isUrlMenu = menu.hasOwnProperty('url');
  const href = menu.hasOwnProperty('path') ? (menu as PathMenu).path : (menu as UrlMenu).url;

  return (
    <ListItem disableGutters={true} className="mr-1 w-auto">
      <ListItemButton
        LinkComponent={Link}
        href={href}
        target={isUrlMenu ? '_blank' : undefined}
        rel={isUrlMenu ? 'noopener noreferrer' : undefined}
        className="rounded-full px-3 py-1.5"
      >
        {menu.icon ? (
          <ListItemIcon>
            <Icon name={menu.icon} className="align-text-bottom" />
          </ListItemIcon>
        ) : null}
        <ListItemText>{menu.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
