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
    url: 'https://www.infiniteuny.id',
    title: 'INFINITE Dashboard',
    tagline: "Let's Make Infinite Technology!",
    description:
      'INFINITE Dashboard is a platform for our members to manage their day-to-day activities.',
    image: 'https://www.infiniteuny.id/assets/images/og-image.png',
    locale: 'id-ID',
  },
  internal: {
    nav: {
      menus: [
        {
          name: 'Home',
          icon: 'home',
          path: '/',
          matcher: '\\/',
          permissions: [],
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
              name: 'Fund Applications',
              icon: 'request-quote',
              path: '/fund-applications',
              matcher: '^\\/fund-applications',
              permissions: [
                'create-fund-application',
                'create-own-fund-application',
                'read-fund-application',
                'read-own-fund-application',
                'update-fund-application',
                'update-own-fund-application',
                'delete-fund-application',
                'delete-own-fund-application',
              ],
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
              name: 'Core Teams',
              icon: 'groups-3',
              path: '/core-teams',
              matcher: '^\\/core-teams',
              permissions: [
                'create-core-team',
                'read-core-team',
                'update-core-team',
                'delete-core-team',
              ],
            },
            {
              name: 'Community Group Administrators',
              icon: 'diversity-2',
              path: '/community-group-admins',
              matcher: '^\\/community-group-admins',
              permissions: [
                'create-community-group-admin',
                'read-community-group-admin',
                'update-community-group-admin',
                'delete-community-group-admin',
              ],
            },
            {
              name: 'Project Galleries',
              icon: 'business-center',
              path: '/project-galleries',
              matcher: '^\\/project-galleries',
              permissions: [
                'create-project-gallery',
                'read-project-gallery',
                'update-project-gallery',
                'delete-project-gallery',
              ],
            },
            {
              name: 'Testimonials',
              icon: 'reviews',
              path: '/testimonials',
              matcher: '^\\/testimonials',
              permissions: [
                'create-testimonial',
                'read-testimonial',
                'update-testimonial',
                'delete-testimonial',
              ],
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
              name: 'Teams',
              icon: 'groups',
              path: '/teams',
              matcher: '^\\/teams',
              permissions: [
                'create-team',
                'create-own-team',
                'read-team',
                'read-own-team',
                'update-team',
                'update-own-team',
                'delete-team',
                'delete-own-team',
              ],
            },
            {
              name: 'Groups',
              icon: 'people-alt',
              path: '/groups',
              matcher: '^\\/groups',
              permissions: ['create-group', 'read-group', 'update-group', 'delete-group'],
            },
            {
              name: 'Permissions',
              icon: 'lock',
              path: '/permissions',
              matcher: '^\\/permissions',
              permissions: [
                'create-permission',
                'read-permission',
                'update-permission',
                'delete-permission',
              ],
            },
          ],
        },
        {
          name: 'Settings',
          icon: 'settings',
          path: '/settings',
          matcher:
            '^\\/(settings|degrees|faculties|majors|personas|team-types|core-team-divisions|community-groups|competition-organizer-types|competition-outputs|competition-ranks|competition-scales|competition-time-ranges)',
        },
      ],
    },
  },
};
