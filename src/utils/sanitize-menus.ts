import { PathMenu, NestedMenu } from '@app/domain/entities';

export function sanitizeMenus(
  menus: (PathMenu | NestedMenu<PathMenu>)[],
  userPermissions: string[],
): (PathMenu | NestedMenu<PathMenu>)[] {
  const userPermissionsSet = new Set(userPermissions);

  const isNestedMenu = (menu: PathMenu | NestedMenu<PathMenu>): menu is NestedMenu<PathMenu> => {
    return 'items' in menu;
  };

  return menus.flatMap((menu) => {
    if (!isNestedMenu(menu)) {
      if (menu.permissions && menu.permissions.length > 0) {
        if (!menu.permissions.some((permission) => userPermissionsSet.has(permission))) {
          return [];
        }
      }

      return menu;
    } else {
      const sanitizedItems = menu.items.filter((item) => {
        if (item.permissions && item.permissions.length > 0) {
          return item.permissions.some((permission) => userPermissionsSet.has(permission));
        }

        return true;
      });

      if (sanitizedItems.length === 0) {
        return [];
      }

      return {
        ...menu,
        items: sanitizedItems,
      };
    }
  });
}
