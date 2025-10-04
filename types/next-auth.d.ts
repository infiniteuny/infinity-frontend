import { type DefaultSession } from 'next-auth';
import { type DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * The shape of the returned object in the OAuth providers' `profile` callback,
   * available in the `jwt` and `session` callbacks,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name: string;
    username: string;
    emailAddress: string;
    picture?: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
    error?: 'AccessTokenExpiredError';
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    username: string;
    accessToken: string;
    expiresAt: number;
    error?: 'AccessTokenExpiredError';
  }
}
