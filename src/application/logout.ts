import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

@injectable()
export class Logout implements UseCase<void> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(): Promise<void> {
    const signOutResult = await this.authRepository.signOut();

    return match(signOutResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => undefined,
    });
  }
}
