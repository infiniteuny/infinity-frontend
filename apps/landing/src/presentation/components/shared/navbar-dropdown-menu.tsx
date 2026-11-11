'use client';

import Link from 'next/link';
import { ExpandMoreRounded, OpenInNewRounded } from '@mui/icons-material';
import { Icon } from '@infiniteuny/infinity-ui';
import {
  ClickAwayListener,
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { NestedMenu, PathMenu, UrlMenu } from '@infiniteuny/infinity-domain';
import { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';

type Props = {
  menu: NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>;
};

export function NavbarDropdownMenu({ menu }: Props) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((open) => !open);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <ListItem disableGutters={true} className="mr-1 w-auto">
        <ListItemButton
          ref={anchorRef}
          component="button"
          id="dropdown-button"
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
          className="rounded-full px-3 py-1.5"
        >
          {menu.icon ? (
            <ListItemIcon>
              <Icon name={menu.icon} className="align-text-bottom" />
            </ListItemIcon>
          ) : null}
          <ListItemText>{menu.name}</ListItemText>
          <ExpandMoreRounded fontSize="small" className="ml-0.5" />
        </ListItemButton>
      </ListItem>
      <Popper
        open={open}
        // eslint-disable-next-line react-hooks/refs
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom"
        disablePortal
        transition
        className="z-50"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: 'top' }}>
            <Paper className="mt-1 rounded-2xl">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="dropdown-menu"
                  aria-labelledby="dropdown-button"
                  onKeyDown={handleListKeyDown}
                >
                  {menu.items
                    ? menu.items.map((item, i) => {
                        const isExternal = item.hasOwnProperty('url');
                        const href = item.hasOwnProperty('path')
                          ? (item as PathMenu).path
                          : (item as UrlMenu).url;

                        return (
                          <MenuItem
                            key={i}
                            component={isExternal ? 'a' : Link}
                            href={href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            onClick={handleClose}
                            className="flex items-center justify-between gap-3"
                          >
                            <span>{item.name}</span>
                            {isExternal ? <OpenInNewRounded sx={{ fontSize: 16 }} /> : null}
                          </MenuItem>
                        );
                      })
                    : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
}
