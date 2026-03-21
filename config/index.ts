import { NestedMenu, PathMenu, UrlMenu } from '@app/domain/entities';

export * from './fonts';
export * from './symbols';
export * from './themes';

export const APP: {
  site: {
    url: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    locale: string;
  };
  internal: {
    nav: {
      menus: Required<
        PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>
      >[];
    };
    sidebar: {
      menus: RequiredBy<PathMenu | NestedMenu<RequiredBy<PathMenu, 'icon'>>, 'icon'>[];
    };
  };
} = {
  site: {
    url: 'https:/www.infiniteuny.id',
    title: 'INFINITE Dashboard',
    tagline: "Let's Make Infinite Technology!",
    description:
      'INFINITE Dashboard is a platform for our members to manage their day-to-day activities.',
    image: 'https:/www.infiniteuny.id/assets/images/og-image.png',
    locale: 'id_ID',
  },
  internal: {
    nav: {
      menus: [
        {
          name: 'Home',
          icon: 'home',
          path: '/',
          matcher: '\\/',
        },
      ],
    },
    sidebar: {
      menus: [
        {
          name: 'Overview',
          icon: 'home',
          path: '/',
        },
        {
          name: 'Competitions',
          icon: 'emoji-events',
          items: [
            {
              name: 'Teams',
              icon: 'groups',
              path: '/teams',
              matcher: '^\\/teams',
            },
            {
              name: 'Fund Applications',
              icon: 'request-quote',
              path: '/fund-applications',
              matcher: '^\\/fund-applications',
            },
            {
              name: 'Achievements',
              icon: 'military-tech',
              path: '/achievements',
              matcher: '^\\/achievements',
            },
          ],
        },
        {
          name: 'Communities',
          icon: 'hub',
          items: [
            {
              name: 'Community Group Administrators',
              icon: 'diversity-2',
              path: '/community-group-admins',
              matcher: '^\\/community-group-admins',
            },
            {
              name: 'Core Teams',
              icon: 'groups-3',
              path: '/core-teams',
              matcher: '^\\/core-teams',
            },
            {
              name: 'Project Galleries',
              icon: 'business-center',
              path: '/project-galleries',
              matcher: '^\\/project-galleries',
            },
            {
              name: 'Testimonials',
              icon: 'reviews',
              path: '/testimonials',
              matcher: '^\\/testimonials',
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
              path: '/users',
              matcher: '^\\/users',
            },
            {
              name: 'Groups',
              icon: 'people-alt',
              path: '/groups',
              matcher: '^\\/groups',
            },
            {
              name: 'Permissions',
              icon: 'lock',
              path: '/permissions',
              matcher: '^\\/permissions',
            },
          ],
        },
        {
          name: 'Settings',
          icon: 'settings',
          path: '/settings',
        },
      ],
    },
  },
};
