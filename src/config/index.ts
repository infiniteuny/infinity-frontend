import { NestedMenu, PathMenu, UrlMenu } from '@/domain/entities';

export const Config: {
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
      menus: (PathMenu | UrlMenu | NestedMenu)[];
    };
    footer: {
      menus: (PathMenu | UrlMenu)[][];
    };
  };
  internal: {
    nav: {
      menus: (PathMenu | UrlMenu | NestedMenu)[];
    };
    dashboard: {
      sidebar: {
        title: string;
        menus: (PathMenu | NestedMenu<PathMenu[]>)[];
      };
    };
    tools: {
      sidebar: {
        title: string;
        backButton: PathMenu;
        menus: (PathMenu | NestedMenu<PathMenu[]>)[];
      };
    };
  };
} = {
  site: {
    url: 'https://www.infiniteuny.id',
    title: 'INFINITE UNY',
    tagline: "Let's Make Infinite Technology!",
    description: 'INFINITE UNY',
    image: 'https://www.infiniteuny.id/images/og-image.png',
    locale: 'id_ID',
  },
  public: {
    nav: {
      menus: [
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'About',
          path: '/#about',
        },
        {
          name: 'Team',
          path: '/teams',
        },
        {
          name: 'Events',
          path: '/events',
        },
      ],
    },
    footer: {
      menus: [
        [
          {
            name: 'Home',
            path: '/',
          },
          {
            name: 'About',
            path: '/#about',
          },
          {
            name: 'Team',
            path: '/teams',
          },
          {
            name: 'Events',
            path: '/events',
          },
        ],
        [
          {
            name: 'Leaderboard',
            path: '/leaderboard',
          },
          {
            name: 'Membership Checker',
            path: '/tools/membership',
          },
          {
            name: 'Link Shortener',
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
          path: '/',
        },
      ],
    },
    dashboard: {
      sidebar: {
        title: 'Dashboard',
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
    tools: {
      sidebar: {
        title: 'Tools',
        backButton: {
          name: 'Dashboard',
          path: '/dashboard',
        },
        menus: [
          {
            name: 'Freepik',
            icon: 'image',
            items: [
              {
                name: 'Download',
                path: '/tools/freepik',
              },
              {
                name: 'Assets',
                path: '/tools/freepik/assets',
              },
            ],
          },
          {
            name: 'Inventory',
            icon: 'inventory-2',
            items: [
              {
                name: 'Borrow',
                icon: 'download',
                path: '/tools/inventory',
              },
            ],
          },
        ],
      },
    },
  },
};
