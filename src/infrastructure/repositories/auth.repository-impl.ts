import type { AuthDataSource } from '@app/infrastructure/datasources/server';
import { AuthRepository } from '@app/domain/repositories';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

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
}
