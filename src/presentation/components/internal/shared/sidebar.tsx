'use client';

import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';
import {
  Backdrop,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';
import { NestedMenu, PathMenu } from '@app/domain/entities';
import { SidebarDropdownMenu } from './sidebar-dropdown-menu';
import { SidebarMenu } from './sidebar-menu';
import { useEffect } from 'react';

type Props = {
  menus: (PathMenu | NestedMenu<PathMenu>)[];
};

export function InternalSidebar({ menus }: Props) {
  const [
    sidebarOpened,
    sidebarExtended,
    sidebarHovered,
    setSidebarOpenedState,
    getSidebarExtendedState,
    setSidebarExtendedState,
    setSidebarHoveredState,
  ] = useStore(
    internalStore,
    useShallow((s) => [
      s.sidebarOpened,
      s.sidebarExtended,
      s.sidebarHovered,
      s.setSidebarOpenedState,
      s.getSidebarExtendedState,
      s.setSidebarExtendedState,
      s.setSidebarHoveredState,
    ]),
  );

  const handleBackdrop = () => setSidebarOpenedState(false);
  const handleExtend = () => setSidebarExtendedState(!sidebarExtended);
  const handleMouseEnter = () => setSidebarHoveredState(true);
  const handleMouseLeave = () => setSidebarHoveredState(false);

  useEffect(() => {
    getSidebarExtendedState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Backdrop open={sidebarOpened} onClick={handleBackdrop} className="z-[500] lg:hidden" />
      <Container
        component="aside"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          bgcolor: 'surfaceContainer.main',
        }}
        className={`flex flex-col fixed left-0 top-0 bottom-0 w-[260px] max-w-full z-[550] px-0
        pt-[74px] overflow-x-auto no-scrollbar transition-all lg:translate-x-0 ${
          sidebarOpened ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarExtended || sidebarHovered ? '' : 'lg:!w-20 lg:overflow-y-hidden'}`}
      >
        <div className="flex flex-col justify-between min-h-full">
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
            className="hidden sticky bottom-0 z-[11] px-0 mt-auto lg:block"
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
        </div>
      </Container>
    </>
  );
}
