import type { UserPersonaRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { UserPersona } from '@infiniteuny/infinity-domain';

export type DeleteUserPersonaParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteUserPersona implements UseCase<
  Promise<Either<UserPersona, Error>>,
  DeleteUserPersonaParams
> {
  private readonly userPersonaRepository: UserPersonaRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserPersonaRepository)
    userPersonaRepository: UserPersonaRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userPersonaRepository = userPersonaRepository;
    this.authRepository = authRepository;
  }

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<UserPersona, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userPersonaRepository.deleteUserPersona(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
