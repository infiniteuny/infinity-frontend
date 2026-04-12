import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type LogoutAchievementParams = [request?: Request];

@injectable()
export class Logout implements UseCase<void> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(request?: Request): Promise<void> {
    const signOutResult = await this.authRepository.signOut(request);

    return match(signOutResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => undefined,
    });
  }
}
