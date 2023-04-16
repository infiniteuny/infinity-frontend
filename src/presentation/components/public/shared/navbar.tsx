import { NestedMenu, PathMenu, UrlMenu } from '@/domain/entities';

type Props = {
  menus?: (PathMenu | UrlMenu | NestedMenu)[];
};

export function PublicNavbar({ menus }: Props) {
  return (
    <nav className="md:flex">
      <ul className="hidden mr-3 text-center text-white md:flex">
        {menus
          ? menus.map((menu, i) => {
              if (menu.hasOwnProperty('path')) {
                return (
                  <a key={i} href={(menu as PathMenu).path}>
                    <li className="mx-3">{menu.name}</li>
                  </a>
                );
              } else if (menu.hasOwnProperty('url')) {
                return (
                  <a key={i} href={(menu as UrlMenu).url}>
                    <li className="mx-3">{menu.name}</li>
                  </a>
                );
              }
            })
          : null}
      </ul>
    </nav>
  );
}
