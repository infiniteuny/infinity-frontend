export class Menu {
  public name: string;
  public icon?: string;
  public permissions?: string[];

  public constructor(name: string, icon?: string, permissions?: string[]) {
    this.name = name;
    this.icon = icon;
    this.permissions = permissions;
  }
}

export class PathMenu extends Menu {
  public path: string;
  public matcher?: string;

  public constructor(
    name: string,
    icon: string,
    path: string,
    matcher?: string,
    permissions?: string[],
  ) {
    super(name, icon, permissions);
    this.path = path;
    this.matcher = matcher;
  }
}

export class UrlMenu extends Menu {
  public url: string;

  public constructor(name: string, icon: string, url: string, permissions?: string[]) {
    super(name, icon, permissions);
    this.url = url;
  }
}

export class NestedMenu<T extends Menu = PathMenu | UrlMenu> extends Menu {
  public items: Array<T>;

  public constructor(name: string, icon: string, items: Array<T>, permissions?: string[]) {
    super(name, icon, permissions);
    this.items = items;
  }
}
