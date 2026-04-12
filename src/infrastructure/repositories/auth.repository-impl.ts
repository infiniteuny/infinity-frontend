import type { AuthServerDataSource } from '@app/infrastructure/datasources/server';
import type { AuthClientDataSource } from '@app/infrastructure/datasources/client';
import { AuthRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { inject } from 'inversify';
import { NextRequest } from 'next/server';
import { Session } from '@app/domain/entities';
import { SYMBOLS } from '@config';

export class AuthRepositoryImpl implements AuthRepository {
  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    private authDataSource: AuthServerDataSource | AuthClientDataSource,
    private isServer = typeof window === 'undefined',
  ) {}

  public async signIn(callbackUrl?: string): Promise<Either<void, Error>> {
    try {
      if (this.isServer) {
        await (this.authDataSource as AuthServerDataSource).api.signInWithOAuth2({
          body: {
            providerId: 'infinite-sso',
            callbackURL: callbackUrl,
          },
        });
      } else {
        await (this.authDataSource as AuthClientDataSource).signIn.oauth2({
          providerId: 'infinite-sso',
          callbackURL: callbackUrl,
        });
      }

      return right(undefined);
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public async signOut(): Promise<Either<void, Error>> {
    try {
      if (this.isServer) {
        await (this.authDataSource as AuthServerDataSource).api.signOut();
      } else {
        await (this.authDataSource as AuthClientDataSource).signOut();
      }

      return right(undefined);
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public async getSession(request?: Request): Promise<Either<Session, Error>> {
    try {
      let session;

      if (this.isServer) {
        let headers: HeadersInit;

        if (request) {
          headers = new NextRequest(request).headers;
        } else {
          const { headers: headersFunc } = await import('next/headers.js');
          headers = await headersFunc();
        }

        session = await (this.authDataSource as AuthServerDataSource).api.getSession({
          headers,
        });
      } else {
        const { data, error } = await (this.authDataSource as AuthClientDataSource).getSession();
        session = data;
        if (error) {
          return left(new Error(error.message));
        }
      }

      if (!session) {
        return left(new Error('Session not found'));
      }

      return right(
        new Session(
          {
            id: session.account?.accountId || '',
            name: session.user.name || '',
            username: session.user.username || '',
            emailAddress: session.user.email || '',
            picture: session.user.image || undefined,
          },
          session.account!.accessTokenExpiresAt!,
        ),
      );
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public async getAccessToken(request?: Request): Promise<Either<string, Error>> {
    try {
      let accessToken;

      if (this.isServer) {
        let headers: HeadersInit;

        if (request) {
          headers = new NextRequest(request).headers;
        } else {
          const { headers: headersFunc } = await import('next/headers.js');
          headers = await headersFunc();
        }

        accessToken = await (this.authDataSource as AuthServerDataSource).api.getAccessToken({
          headers,
          body: {
            providerId: 'infinite-sso',
          },
        });
      } else {
        const { data, error } = await (this.authDataSource as AuthClientDataSource).getAccessToken({
          providerId: 'infinite-sso',
        });
        accessToken = data;
        if (error) {
          return left(new Error(error.message));
        }
      }

      if (!accessToken) {
        return left(new Error('Access token not found'));
      }

      return right(accessToken.accessToken);
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
