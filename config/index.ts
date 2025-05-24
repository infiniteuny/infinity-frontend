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
          name: 'Competitions',
          icon: 'emoji-events',
          items: [
            {
              name: 'Teams',
              icon: 'groups',
              path: '/dashboard/teams',
            },
            {
              name: 'Fund Applications',
              icon: 'request-quote',
              path: '/dashboard/fund-applications',
            },
            {
              name: 'Achievements',
              icon: 'military-tech',
              path: '/dashboard/achievements',
            },
          ],
        },
        {
          name: 'Communities',
          icon: 'hub',
          items: [
            {
              name: 'Community Groups',
              icon: 'groups-3',
              path: '/dashboard/community-groups',
            },
            {
              name: 'Community Group Administrators',
              icon: 'manage-account',
              path: '/dashboard/community-group-admins',
            },
            {
              name: 'Core Teams',
              icon: 'diversity-2',
              path: '/dashboard/core-teams',
            },
            {
              name: 'Project Galleries',
              icon: 'business-center',
              path: '/dashboard/project-galleries',
            },
            {
              name: 'Testimonials',
              icon: 'reviews',
              path: '/dashboard/testimonials',
            },
          ],
        },
        {
          name: 'Directories',
          icon: 'workspaces',
          items: [
            {
              name: 'Users',
              icon: 'person',
              path: '/dashboard/users',
            },
            {
              name: 'Groups',
              icon: 'people-alt',
              path: '/dashboard/groups',
            },
            {
              name: 'Permissions',
              icon: 'lock',
              path: '/dashboard/permissions',
            },
          ],
        },
        {
          name: 'Settings',
          icon: 'settings',
          path: '/dashboard/settings',
        },
      ],
    },
  },
};
