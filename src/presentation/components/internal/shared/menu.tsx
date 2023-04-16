import { Icon } from '@/presentation/components/shared';
import { internalStore, useStore } from '@/presentation/hooks';
import { PathMenu } from '@/domain/entities';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  menu: PathMenu;
};

export function SidebarMenu({ menu }: Props) {
  const path = usePathname();
  const [active, setActive] = useState(false);
  const [sidebarExtended, sidebarHovered] = useStore(internalStore, (s) => [
    s.sidebarExtended,
    s.sidebarHovered,
  ]);

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
      className={`mr-2 rounded-r-full ${
        sidebarExtended || sidebarHovered ? '' : 'lg:mr-0 lg:pr-0 lg:rounded-r-none'
      }`}
    >
      <li
        className={`flex items-center pr-4 py-2 text-base text-[#3c7c60] rounded-r-full
      transition-all ${
        active ? 'text-white bg-[#3c7c60]' : 'hover:bg-[#3c7c60] hover:bg-opacity-10'
      } ${sidebarExtended || sidebarHovered ? '' : 'lg:pr-0 lg:rounded-r-none'}`}
      >
        {menu.icon ? (
          <div className="shrink-0 w-14 text-center">
            <Icon name={menu.icon} className="align-text-bottom " />
          </div>
        ) : null}
        <span className="overflow-hidden text-ellipsis">{menu.name}</span>
      </li>
    </Link>
  );
}
