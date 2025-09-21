import type { AuthDataSource } from '@app/infrastructure/datasources/server';
import { AuthRepository } from '@app/domain/repositories';
import { inject } from 'inversify';
import { Session } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { DateTime } from 'effect/index';

export class AuthRepositoryImpl implements AuthRepository {
  public constructor(
    @inject(SYMBOLS.AuthDataSource)
    private authDataSource: AuthDataSource,
  ) {}

  public async signIn(callbacksUrl?: string): Promise<void> {
    await this.authDataSource.signIn('authentik', {
      redirectTo: callbacksUrl,
    });
  }

  public async getSession(): Promise<Session | null> {
    const session = await this.authDataSource.auth();

    return session
      ? new Session(
          {
            id: session?.user.id || '',
            name: session?.user.name || '',
            username: session?.user.username || '',
            emailAddress: session?.user.email || '',
            picture: session?.user.image || undefined,
          },
          session?.accessToken || '',
          DateTime.unsafeMake(session!.expires!).pipe(DateTime.toDate),
        )
      : null;
  }
}
