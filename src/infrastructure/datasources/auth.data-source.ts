import Authentik from 'next-auth/providers/authentik';
import NextAuth from 'next-auth';
import { getUsers } from '@app/application/server';
import { match } from 'effect/Either';
import { NextAuthResult } from 'next-auth';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthDataSource extends NextAuthResult {}

export const authDataSourceImpl: AuthDataSource = NextAuth({
  providers: [Authentik],
  callbacks: {
    signIn: async function signIn({ user }) {
      const users = await getUsers({ emailAddress: user.email! }, undefined, false);

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
      if (account) token.accessToken = account.access_token!;
      if (user) token.username = user.username;

      return token;
    },
    session: async function session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub!,
        username: token.username,
      };
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  basePath: '/auth',
});
