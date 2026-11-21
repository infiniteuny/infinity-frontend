'use client';

import Link from 'next/link';
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
  Popper,
  Paper,
} from '@mui/material';
import { NestedMenu, PathMenu, UrlMenu } from '@infiniteuny/infinity-domain';
import {
  KeyboardEvent,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

type Props = {
  menu: NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>;
};

export function NavbarDropdownMenu({ menu }: Props) {
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
      <ListItem disableGutters={true} className="mr-3">
        <ListItemButton
          ref={anchorRef}
          component="button"
          id={buttonId}
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
          className="py-1.5"
        >
          {menu.icon ? (
            <ListItemIcon>
              <Icon name={menu.icon} className="align-text-bottom" />
            </ListItemIcon>
          ) : null}
          <ListItemText>{menu.name}</ListItemText>
        </ListItemButton>
      </ListItem>
      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom"
        disablePortal
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: 'top' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id={menuId}
                  aria-labelledby={buttonId}
                  onKeyDown={handleListKeyDown}
                >
                  {menu.items
                    ? menu.items.map((item) => {
                        return (
                          <MenuItem
                            key={item.name}
                            component={Link}
                            href={'path' in item ? item.path : item.url}
                            onClick={handleClose}
                          >
                            {item.name}
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
