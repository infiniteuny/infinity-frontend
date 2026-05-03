import { betterAuth, BetterAuthOptions } from 'better-auth/minimal';
import { customSession, genericOAuth } from 'better-auth/plugins';
import { getAccountCookie } from 'better-auth/cookies';
import { GetUsersWithToken, GetUserPermissionsWithToken } from '@app/application';
import { match } from 'effect/Either';
import { nextCookies } from 'better-auth/next-js';
import { Redis } from 'ioredis';
import { redisStorage } from '@better-auth/redis-storage';

export type AuthServerDataSource = ReturnType<typeof authServerDataSourceImpl>;

const isCIBuild = process.env.CI === 'true' || process.env.CI === '1';

const additionalOptions = {
  user: {
    additionalFields: {
      internalId: {
        type: 'string',
        input: false,
      },
      username: {
        type: 'string',
        input: false,
      },
      permissions: {
        type: 'string[]',
        input: false,
      },
    },
  },
} satisfies BetterAuthOptions;

const createRedisClient = () => {
  if (isCIBuild) return undefined;

  const sentinelHosts = process.env.REDIS_SENTINEL_HOSTS;

  if (sentinelHosts) {
    const sentinels = sentinelHosts.split(',').map((host) => {
      const [hostname, port] = host.trim().split(':');
      return {
        host: hostname,
        port: port ? parseInt(port, 10) : 26379,
      };
    });

    return new Redis({
      sentinels,
      name: process.env.REDIS_SENTINEL_NAME || 'mymaster',
      password: process.env.REDIS_PASSWORD,
      sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD,
      role: 'master',
      sentinelRetryStrategy: (times) => Math.min(times * 10, 1000),
      sentinelReconnectStrategy: () => 60000,
      failoverDetector: true,
    });
  }

  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
  });
};

const redis = createRedisClient();

export const authServerDataSourceImpl = (
  getUsers: GetUsersWithToken,
  getUserPermissions: GetUserPermissionsWithToken,
) => {
  return betterAuth({
    ...additionalOptions,
    secret: isCIBuild ? 'some-ci-default-secret-please-change' : process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_BASE_URL || 'http://localhost:3000',
    basePath: '/auth',
    secondaryStorage: isCIBuild
      ? undefined
      : redisStorage({
          client: redis,
          keyPrefix: 'auth:',
        }),
    session: {
      expiresIn: 1 * 60 * 60, // 1 hour
      updateAge: 10 * 60, // 10 minutes
      cookieCache: {
        enabled: false,
        refreshCache: false,
      },
    },
    account: {
      storeStateStrategy: 'cookie',
      storeAccountCookie: true,
      accountLinking: {
        enabled: false,
      },
    },
    plugins: [
      nextCookies(),
      genericOAuth({
        config: [
          {
            providerId: 'infinite-sso',
            clientId: process.env.BETTER_AUTH_INFINITE_SSO_ID!,
            clientSecret: process.env.BETTER_AUTH_INFINITE_SSO_SECRET!,
            discoveryUrl: process.env.BETTER_AUTH_INFINITE_SSO_DISCOVERY_URL!,
            getUserInfo: async (tokens) => {
              const accessTokenPayload = Buffer.from(
                tokens.accessToken?.split('.')[1] ?? '',
                'base64',
              ).toString('utf-8');
              const accessTokenData = JSON.parse(accessTokenPayload);
              const id = accessTokenData.sub;
              const email = accessTokenData.email;

              if (!email || email.trim() === '') {
                throw new Error('Email not found in access token');
              }

              const usersResult = await getUsers.execute(
                undefined,
                { emailAddress: email },
                undefined,
                undefined,
              );

              const [users] = match(usersResult, {
                onLeft: (error) => {
                  throw error;
                },
                onRight: (result) => result,
              });

              const userPermissionsResult = await getUserPermissions.execute(
                users[0].id,
                ['nested'],
                undefined,
                tokens.accessToken ?? '',
              );

              const userPermissions = match(userPermissionsResult, {
                onLeft: (error) => {
                  throw error;
                },
                onRight: (result) => result,
              });

              if (users.length !== 1) {
                throw new Error(
                  `Expected to find exactly one user with email ${email}, but found ${users.length} user(s).`,
                );
              }

              return {
                id: id,
                internalId: users[0].id,
                name: users[0].name,
                username: users[0].username,
                email: email,
                emailVerified: true,
                permissions: userPermissions.map((userPermission) => userPermission.name),
              };
            },
            mapProfileToUser: (profile) => ({
              internalId: profile.internalId,
              name: profile.name,
              username: profile.username,
            }),
          },
        ],
      }),
      customSession(async ({ user, session }, ctx) => {
        const account = await getAccountCookie(ctx);

        return {
          session,
          user,
          account,
        };
      }, additionalOptions),
    ],
    databaseHooks: {
      // user: {
      //   update: {
      //     after: async (user, ctx) => {
      //       const account = await getAccountCookie(ctx!);

      //       const userPermissionsResult = await getUserPermissions.execute(
      //         user.internalId as string,
      //         undefined,
      //         account?.accessToken ?? '',
      //       );

      //       const userPermissions = match(userPermissionsResult, {
      //         onLeft: (error) => {
      //           throw error;
      //         },
      //         onRight: (result) => result,
      //       });

      //       console.log(userPermissions);
      //     },
      //   },
      // },
      account: {
        create: {
          before: async (account) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { idToken, ...data } = account;

            return {
              data: {
                idToken: undefined,
                ...data,
              },
            };
          },
        },
      },
    },
    disabledPaths: [
      '/error',
      '/ok',
      '/sign-up/email',
      '/sign-in/email',
      '/sign-in/social',
      '/link-social',
      '/callback/:id',
      '/change-password',
      '/request-password-reset',
      '/reset-password',
      '/reset-password/:token',
      '/verify-password',
      '/change-email',
      '/send-verification-email',
      '/verify-email',
      '/list-accounts',
      '/unlink-account',
      '/account-info',
      '/update-user',
      '/delete-user',
      '/delete-user/callback',
      '/list-sessions',
      '/update-session',
      '/revoke-session',
      '/revoke-sessions',
      '/revoke-other-sessions',
      '/refresh-token',
      '/oauth2/link',
    ],
    onAPIError: {
      errorURL: '/login',
    },
    advanced: {
      cookiePrefix: 'auth',
      database: {
        generateId: 'uuid',
      },
    },
  });
};
