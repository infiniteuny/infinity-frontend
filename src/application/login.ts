import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type LoginParams = [callbackUrl?: string];

@injectable()
export class Login implements UseCase<void, LoginParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(callbackUrl?: string): Promise<void> {
    const redirectUrl = callbackUrl
      ? new URL(callbackUrl).pathname + new URL(callbackUrl).searchParams.toString()
      : undefined;

    await this.authRepository.signIn(redirectUrl);
  }
}
