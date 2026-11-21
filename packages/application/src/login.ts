import type { AuthRepository } from '@infiniteuny/infinity-domain';
import { inject, injectable } from 'inversify';
import { Either } from 'effect/Either';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type LoginParams = [callbackUrl?: string, silent?: boolean];

@injectable()
export class Login implements UseCase<Promise<Either<void, Error>>, LoginParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(callbackUrl?: string, silent?: boolean): Promise<Either<void, Error>> {
    let redirectUrl: string | undefined;

    if (callbackUrl) {
      try {
        const parsed = new URL(callbackUrl, 'http://localhost');
        redirectUrl = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      } catch {
        redirectUrl = undefined;
      }
    }

    return this.authRepository.signIn(redirectUrl, silent);
  }
}
