import NextAuth from 'next-auth';
import Authentik from 'next-auth/providers/authentik';

export const AUTH = NextAuth({
  providers: [Authentik],
  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },
    jwt: async function jwt({ token, user }) {
      return token;
    },
    session: async function session({ session, token }) {
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
