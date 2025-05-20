import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';

export * from './font';
export * from './symbols';
export * from './theme';

export const APP: {
  site: {
    url: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    locale: string;
  };
  public: {
    nav: {
      menus: Required<
        PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
      >[];
    };
    footer: {
      menus: Required<Omit<PathMenu, 'matcher'> | UrlMenu>[][];
    };
  };
  internal: {
    nav: {
      menus: Required<
        PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
      >[];
    };
    sidebar: {
      menus: RequiredProperty<PathMenu | NestedMenu<RequiredProperty<PathMenu, 'icon'>>, 'icon'>[];
    };
  };
} = {
  site: {
    url: 'https://www.infiniteuny.id',
    title: 'INFINITE UNY',
    tagline: "Let's Make Infinite Technology!",
    description: 'INFINITE UNY',
    image: 'https://www.infiniteuny.id/assets/images/og-image.png',
    locale: 'id_ID',
  },
  public: {
    nav: {
      menus: [
        {
          name: 'Home',
          icon: 'home',
          path: '/',
          matcher: '/',
        },
        {
          name: 'About',
          icon: 'info',
          path: '/#about',
          matcher: '/#about',
        },
        {
          name: 'Team',
          icon: 'groups',
          path: '/teams',
          matcher: '/teams',
        },
        {
          name: 'Events',
          icon: 'event',
          path: '/events',
          matcher: '/events',
        },
      ],
    },
    footer: {
      menus: [
        [
          {
            name: 'Home',
            icon: 'home',
            path: '/',
          },
          {
            name: 'About',
            icon: 'info',
            path: '/#about',
          },
          {
            name: 'Team',
            icon: 'groups',
            path: '/teams',
          },
          {
            name: 'Events',
            icon: 'event',
            path: '/events',
          },
        ],
        [
          {
            name: 'Leaderboard',
            icon: 'leaderboard',
            path: '/leaderboard',
          },
          {
            name: 'Membership Checker',
            icon: 'verified_user',
            path: '/tools/membership',
          },
          {
            name: 'Link Shortener',
            icon: 'link',
            url: 'https://unyku.id/',
          },
        ],
      ],
    },
  },
  internal: {
    nav: {
      menus: [
        {
          name: 'Home',
          icon: 'home',
          path: '/',
          matcher: '/',
        },
      ],
    },
    sidebar: {
      menus: [
        {
          name: 'Overview',
          icon: 'home',
          path: '/dashboard',
        },
        {
          name: 'Achivements',
          icon: 'emoji-events',
          path: '/dashboard/achievements',
        },
        {
          name: 'Fundraisings',
          icon: 'monetization-on',
          path: '/dashboard/fundraisings',
        },
        {
          name: 'Inventories',
          icon: 'inventory-2',
          path: '/dashboard/inventories',
        },
        {
          name: 'Members',
          icon: 'people-alt',
          path: '/dashboard/members',
        },
        {
          name: 'Tools',
          icon: 'handyman',
          path: '/tools',
        },
      ],
    },
  },
};
