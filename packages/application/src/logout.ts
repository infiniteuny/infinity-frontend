import type { AuthRepository } from '@infiniteuny/infinity-domain';
import { inject, injectable } from 'inversify';
import { Either } from 'effect/Either';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type LogoutAchievementParams = [request?: Request];

@injectable()
export class Logout implements UseCase<Promise<Either<void, Error>>> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(request?: Request): Promise<Either<void, Error>> {
    return this.authRepository.signOut(request);
  }
}
