import Link from 'next/link';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Icon } from '@app/presentation/components/shared';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';
import { MouseEvent, useMemo, useState } from 'react';
import { NestedMenu, PathMenu } from '@app/domain/entities';
import { usePathname } from 'next/navigation';

type Props = {
  menu: NestedMenu<PathMenu>;
};

type ItemProps = {
  menu: PathMenu;
};

export function SidebarDropdownMenu({ menu }: Props) {
  const path = usePathname();
  const mediaQueryGreaterThanLg = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'));
  const [expanded, setExpanded] = useState(false);
  const [sidebarExtended, sidebarHovered] = useStore(
    internalStore,
    useShallow((s) => [s.sidebarExtended, s.sidebarHovered]),
  );

  const active = useMemo(() => {
    let status = false;

    menu.items.map((item) => {
      if (item.path === path || (item.matcher ? RegExp(item.matcher).test(path) : false)) {
        status = true;
      }
    });

    setExpanded(status);

    return status;
  }, [menu.items, path]);

  const handleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    if (!active) {
      event.preventDefault();
      event.stopPropagation();
      setExpanded((expanded) => !expanded);
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
                className="align-text-bottom "
              />
            </ListItemIcon>
          ) : null}
          <ListItemText
            className={`mr-8 transition-all ${
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
  const [sidebarExtended, sidebarHovered] = useStore(
    internalStore,
    useShallow((s) => [s.sidebarExtended, s.sidebarHovered]),
  );

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
              className="align-text-bottom "
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
