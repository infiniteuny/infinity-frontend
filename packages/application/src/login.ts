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
    const redirectUrl = callbackUrl
      ? new URL(callbackUrl).pathname + new URL(callbackUrl).searchParams.toString()
      : undefined;

    return this.authRepository.signIn(redirectUrl, silent);
  }
}
