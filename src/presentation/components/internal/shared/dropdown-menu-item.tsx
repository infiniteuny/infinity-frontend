import { PathMenu } from '@/domain/entities';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type Props = {
  menu: PathMenu;
};

export function SidebarDropdownMenuItem({ menu }: Props) {
  const path = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (menu.path === path) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [menu.path, path]);

  return (
    <Link href={menu.path}>
      <li
        className={`flex items-center pl-14 pr-4 py-1 mr-10 text-base text-[#3c7c60] rounded-r-full ${
          active ? 'text-white bg-[#3c7c60]' : 'hover:bg-[#3c7c60] hover:bg-opacity-10'
        }`}
      >
        <span className="overflow-hidden text-ellipsis">{menu.name}</span>
      </li>
    </Link>
  );
}
