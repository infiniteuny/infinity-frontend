import Link from 'next/link';
import { Icon } from '@app/presentation/components/shared';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { PathMenu } from '@app/domain/entities';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  menu: PathMenu;
};

export function SidebarMenu({ menu }: Props) {
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
      <ListItemButton
        LinkComponent={Link}
        className="px-[13.5px]"
        href={menu.path}
        selected={selected}
      >
        {menu.icon ? (
          <ListItemIcon>
            <Icon
              name={selected ? menu.icon : `${menu.icon}-outlined`}
              className="align-text-bottom"
            />
          </ListItemIcon>
        ) : null}
        <ListItemText
          className={`transition-all ${sidebarExtended || sidebarHovered ? '' : 'lg:opacity-0'}`}
        >
          {menu.name}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
