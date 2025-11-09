import { Icon } from '@app/presentation/components/shared';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';
import { PathMenu } from '@app/domain/entities';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  menu: PathMenu;
};

export function SidebarMenu({ menu }: Props) {
  const path = usePathname();
  const [active, setActive] = useState(false);
  const [sidebarExtended, sidebarHovered] = useStore(
    internalStore,
    useShallow((s) => [s.sidebarExtended, s.sidebarHovered]),
  );

  useEffect(() => {
    if (menu.path === path) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [menu.path, path]);

  return (
    <Link
      href={(menu as PathMenu).path}
      className={`mr-2 rounded-r-full transition-all ${
        sidebarExtended || sidebarHovered ? '' : 'lg:mr-0 lg:rounded-r-none lg:pr-0'
      }`}
    >
      <li
        className={`text-infinite-green flex items-center rounded-r-full py-2 pr-4 text-base transition-all ${
          active ? 'bg-infinite-green text-white' : 'hover:bg-infinite-green/10'
        } ${sidebarExtended || sidebarHovered ? '' : 'lg:rounded-r-none lg:pr-0'}`}
      >
        {menu.icon ? (
          <div className="w-14 shrink-0 text-center">
            <Icon name={menu.icon} className="align-text-bottom" />
          </div>
        ) : null}
        <span className="overflow-hidden text-ellipsis">{menu.name}</span>
      </li>
    </Link>
  );
}
