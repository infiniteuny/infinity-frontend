import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { Either } from 'effect/Either';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type LoginParams = [callbackUrl?: string];

@injectable()
export class Login implements UseCase<Promise<Either<void, Error>>, LoginParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(callbackUrl?: string): Promise<Either<void, Error>> {
    const redirectUrl = callbackUrl
      ? new URL(callbackUrl).pathname + new URL(callbackUrl).searchParams.toString()
      : undefined;

    return this.authRepository.signIn(redirectUrl);
  }
}
