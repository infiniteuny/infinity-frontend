import type { AuthServerDataSource } from '../datasources/server';
import type { AuthClientDataSource } from '../datasources/client';
import { AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, right } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { NextRequest } from 'next/server';
import { Session } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private isServer = typeof window === 'undefined';

  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    private authDataSource: AuthServerDataSource | AuthClientDataSource,
  ) {}

  public async signIn(callbackUrl?: string, silent?: boolean): Promise<Either<void, Error>> {
    try {
      if (this.isServer) {
        return left(new Error('Sign-in is not supported on the server side'));
      } else if (silent) {
        const silentCallbackUrl = callbackUrl || '/_health';
        const { data, error } = await (this.authDataSource as AuthClientDataSource).signIn.social({
          provider: 'infinite-sso',
          callbackURL: silentCallbackUrl,
          errorCallbackURL: silentCallbackUrl,
          disableRedirect: true,
          additionalParams: {
            prompt: 'none',
          },
        });

        if (error || !data?.url) {
          return left(new Error(error?.message || 'Failed to initiate silent sign-in'));
        }

        await new Promise<void>((resolve, reject) => {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.setAttribute('aria-hidden', 'true');

          const cleanup = () => {
            window.clearTimeout(timeoutId);
            iframe.onload = null;
            iframe.onerror = null;
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          };

          const timeoutId = window.setTimeout(() => {
            cleanup();
            reject(new Error('Silent sign-in timed out'));
          }, 10000);

          iframe.onload = () => {
            try {
              const iframeUrl = iframe.contentWindow?.location.href;
              if (!iframeUrl || iframeUrl === 'about:blank') {
                return;
              }

              const parsedUrl = new URL(iframeUrl);
              if (parsedUrl.origin !== window.location.origin) {
                return;
              }

              const oauthError = parsedUrl.searchParams.get('error');
              cleanup();

              if (oauthError) {
                reject(new Error(oauthError));
              } else {
                resolve();
              }
            } catch {
              cleanup();
              reject(new Error('Silent sign-in failed'));
            }
          };

          iframe.onerror = () => {
            cleanup();
            reject(new Error('Silent sign-in iframe error'));
          };

          iframe.src = data.url;
          document.body.appendChild(iframe);
        });
      } else {
        await (this.authDataSource as AuthClientDataSource).signIn.social({
          provider: 'infinite-sso',
          callbackURL: callbackUrl,
        });
      }

      return right(undefined);
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public async signOut(request?: Request): Promise<Either<void, Error>> {
    try {
      if (this.isServer) {
        let headers: HeadersInit;

        if (request) {
          headers = new NextRequest(request).headers;
        } else {
          const { headers: headersFunc } = await import('next/headers.js');
          headers = await headersFunc();
        }
        await (this.authDataSource as AuthServerDataSource).api.signOut({
          headers,
        });
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
            id: session.user.internalId || '',
            name: session.user.name || '',
            username: session.user.username || '',
            emailAddress: session.user.email || '',
            picture: session.user.image || undefined,
          },
          session.user.permissions || [],
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
            useAccountCookie: true,
          },
        });
      } else {
        const { data, error } = await (this.authDataSource as AuthClientDataSource).getAccessToken({
          useAccountCookie: true,
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
