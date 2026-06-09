import Link from 'next/link';
import { Icon } from '@app/presentation/components/shared';
import { InternalStoreContext } from './store-provider';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { PathMenu } from '@app/domain/entities';
import { useContext, useMemo, useSyncExternalStore } from 'react';
import { useInternalStore } from '@app/presentation/hooks';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

type Props = {
  menu: PathMenu;
};

export function SidebarMenu({ menu }: Props) {
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
          className={`transition-opacity ${sidebarExtended || sidebarHovered ? '' : 'lg:opacity-0'}`}
        >
          {menu.name}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
