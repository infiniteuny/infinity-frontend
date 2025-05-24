import Link from 'next/link';
import { Icon } from '@app/presentation/components/shared';
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
import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';
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
      <ListItem disableGutters={true} className="mr-3">
        <ListItemButton
          ref={anchorRef}
          component="button"
          id="dropdown-button"
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
          className="py-[6px]"
        >
          {menu.icon ? (
            <ListItemIcon>
              <Icon name={menu.icon} className="align-text-bottom " />
            </ListItemIcon>
          ) : null}
          <ListItemText>{menu.name}</ListItemText>
        </ListItemButton>
      </ListItem>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
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
                  id="dropdown-menu"
                  aria-labelledby="dropdown-button"
                  onKeyDown={handleListKeyDown}
                >
                  {menu.items
                    ? menu.items.map((item, i) => {
                        return (
                          <MenuItem
                            key={i}
                            component={Link}
                            href={
                              item.hasOwnProperty('path')
                                ? (item as PathMenu).path
                                : (item as UrlMenu).url
                            }
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
