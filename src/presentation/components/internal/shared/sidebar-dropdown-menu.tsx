import Link from 'next/link';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Icon } from '@app/presentation/components/shared';
import { InternalStoreContext } from './store-provider';
import { MouseEvent, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import { NestedMenu, PathMenu } from '@app/domain/entities';
import { useInternalStore } from '@app/presentation/hooks';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

type Props = {
  menu: NestedMenu<PathMenu>;
};

type ItemProps = {
  menu: PathMenu;
};

export function SidebarDropdownMenu({ menu }: Props) {
  const path = usePathname();
  const mediaQueryGreaterThanLg = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [manualExpanded, setManualExpanded] = useState(false);
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );
  const sidebarHovered = useInternalStore(useShallow((s) => s.sidebarHovered));

  const active = useMemo(() => {
    return menu.items.some(
      (item) => item.path === path || (item.matcher ? RegExp(item.matcher).test(path) : false),
    );
  }, [menu.items, path]);

  const expanded = active || manualExpanded;

  const handleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    if (!active) {
      event.preventDefault();
      event.stopPropagation();
      setManualExpanded((prev) => !prev);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemButton
          component="button"
          sx={{
            bgcolor:
              active && (mediaQueryGreaterThanLg ? sidebarExtended || sidebarHovered : true)
                ? 'action.hover'
                : null,
          }}
          className="px-[13.5px]"
          selected={active && !(mediaQueryGreaterThanLg ? sidebarExtended || sidebarHovered : true)}
          onClick={handleExpand}
        >
          {menu.icon ? (
            <ListItemIcon>
              <Icon
                name={active ? menu.icon : `${menu.icon}-outlined`}
                className="align-text-bottom"
              />
            </ListItemIcon>
          ) : null}
          <ListItemText
            className={`mr-8 transition-opacity ${
              sidebarExtended || sidebarHovered ? '' : 'lg:opacity-0'
            }`}
          >
            {menu.name}
          </ListItemText>
          {expanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItemButton>
      </ListItem>
      <Collapse
        in={expanded && (mediaQueryGreaterThanLg ? sidebarExtended || sidebarHovered : true)}
        timeout={100}
        unmountOnExit
      >
        <List disablePadding>
          {menu.items.map((item, i) => (
            <SidebarDropdownItemMenu key={i} menu={item} />
          ))}
        </List>
      </Collapse>
    </>
  );
}

function SidebarDropdownItemMenu({ menu }: ItemProps) {
  const path = usePathname();
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );
  const sidebarHovered = useInternalStore(useShallow((s) => s.sidebarHovered));

  const selected = useMemo(() => {
    return menu.path === path || (menu.matcher ? RegExp(menu.matcher).test(path) : false);
  }, [menu.matcher, menu.path, path]);

  return (
    <ListItem>
      <ListItemButton LinkComponent={Link} href={menu.path} selected={selected} className="ml-2">
        {menu.icon ? (
          <ListItemIcon>
            <Icon
              name={selected ? menu.icon : `${menu.icon}-outlined`}
              className="align-text-bottom"
            />
          </ListItemIcon>
        ) : null}
        <ListItemText className={`${sidebarExtended || sidebarHovered ? '' : 'lg:opacity-0'}`}>
          {menu.name}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
