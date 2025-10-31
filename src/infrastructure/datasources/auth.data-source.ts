import Authentik from 'next-auth/providers/authentik';
import NextAuth from 'next-auth';
import { match } from 'effect/Either';
import { NextAuthResult } from 'next-auth';
import { GetUsers } from '@app/application';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthDataSource extends NextAuthResult {}

export function createAuthDataSourceImpl(getUsers: GetUsers): AuthDataSource {
  return NextAuth({
    providers: [Authentik],
    callbacks: {
      signIn: async function signIn({ user }) {
        const users = await getUsers.execute(
          undefined,
          { emailAddress: user.email! },
          undefined,
          undefined,
          false,
        );

        return match(users, {
          onLeft: () => false,
          onRight: (users) => {
            if (users[0].length === 0) return false;

            user.id = users[0][0].id;
            user.name = users[0][0].name;
            user.username = users[0][0].username;

            return true;
          },
        });
      },
      jwt: async function jwt({ token, user, account }) {
        if (account) {
          if (user) token.username = user.username;

          return {
            ...token,
            expiresAt: account.expires_at! - 120,
            accessToken: account.access_token!,
          };
        } else if (Date.now() < token.expiresAt * 1000) {
          return token;
        } else {
          token.error = 'AccessTokenExpiredError';
          return token;
        }
      },
      session: async function session({ session, token }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub!,
            username: token.username,
          },
          accessToken: token.accessToken,
          error: token.error,
        };
      },
    },
    session: {
      maxAge: 1 * 60 * 60, // 1 hours
      updateAge: 10 * 60, // 10 minutes
    },
    pages: {
      signIn: '/login',
      signOut: '/logout',
      error: '/login',
    },
    basePath: '/auth',
  });
}
