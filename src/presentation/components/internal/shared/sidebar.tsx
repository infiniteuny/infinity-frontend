'use client';

import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { NestedMenu, PathMenu } from '@app/domain/entities';
import { InternalStoreContext } from './store-provider';
import { SidebarDropdownMenu } from './sidebar-dropdown-menu';
import { SidebarMenu } from './sidebar-menu';
import { useContext, useSyncExternalStore } from 'react';
import { useInternalStore } from '@app/presentation/hooks';
import { useShallow } from 'zustand/shallow';

type Props = {
  menus: (PathMenu | NestedMenu<PathMenu>)[];
};

export function InternalSidebar({ menus }: Props) {
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );
  const [
    sidebarOpened,
    sidebarHovered,
    setSidebarOpenedState,
    setSidebarExtendedState,
    setSidebarHoveredState,
  ] = useInternalStore(
    useShallow((s) => [
      s.sidebarOpened,
      s.sidebarHovered,
      s.setSidebarOpenedState,
      s.setSidebarExtendedState,
      s.setSidebarHoveredState,
    ]),
  );

  const handleBackdrop = () => setSidebarOpenedState(false);
  const handleExtend = () => setSidebarExtendedState(!sidebarExtended);
  const handleMouseEnter = () => {
    if (!sidebarExtended) {
      setSidebarHoveredState(true);
    }
  };
  const handleMouseLeave = () => {
    if (!sidebarExtended) {
      setSidebarHoveredState(false);
    }
  };

  return (
    <>
      <Backdrop open={sidebarOpened} onClick={handleBackdrop} className="z-500 lg:hidden" />
      <Container
        component="aside"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          bgcolor: 'surfaceContainer.main',
        }}
        className={`no-scrollbar fixed top-0 bottom-0 left-0 z-550 flex w-65 max-w-full flex-col overflow-x-auto px-0 pt-18.5 transition-all lg:translate-x-0 ${
          sidebarOpened ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarExtended || sidebarHovered ? '' : 'lg:w-20! lg:overflow-y-hidden'}`}
      >
        <Box className="flex min-h-full flex-col justify-between">
          <List>
            {menus
              ? menus.map((menu, i) => {
                  if (menu.hasOwnProperty('path')) {
                    return <SidebarMenu key={i} menu={menu as PathMenu} />;
                  } else if (menu.hasOwnProperty('items')) {
                    return <SidebarDropdownMenu key={i} menu={menu as NestedMenu<PathMenu>} />;
                  }
                })
              : null}
          </List>

          <Container
            component="footer"
            sx={{
              bgcolor: 'surfaceContainer.main',
            }}
            className="sticky bottom-0 z-11 hidden px-0 lg:block"
          >
            <List>
              <ListItem>
                <ListItemButton onClick={handleExtend}>
                  <ListItemIcon>
                    {sidebarExtended ? (
                      <KeyboardDoubleArrowLeftRounded className="align-text-bottom" />
                    ) : (
                      <KeyboardDoubleArrowRightRounded className="align-text-bottom" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    className={`transition-all ${
                      sidebarExtended || sidebarHovered ? '' : 'opacity-0'
                    }`}
                  >
                    {sidebarExtended ? 'Collapse' : 'Expand'}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Container>
        </Box>
      </Container>
    </>
  );
}
