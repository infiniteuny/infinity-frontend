export class Menu {
  public name: string;
  public icon?: string;

  public constructor(name: string, icon?: string) {
    this.name = name;
    this.icon = icon;
  }
}

export class PathMenu extends Menu {
  public path: string;
  public matcher?: string;

  public constructor(name: string, icon: string, path: string, matcher?: string) {
    super(name, icon);
    this.path = path;
    this.matcher = matcher;
  }
}

export class UrlMenu extends Menu {
  public url: string;

  public constructor(name: string, icon: string, url: string) {
    super(name, icon);
    this.url = url;
  }
}

export class NestedMenu<T extends Menu = PathMenu | UrlMenu> extends Menu {
  public items: Array<T>;

  public constructor(name: string, icon: string, items: Array<T>) {
    super(name, icon);
    this.items = items;
  }
}
