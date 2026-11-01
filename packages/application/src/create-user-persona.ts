import type { UserPersonaRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { UserPersona } from '@infiniteuny/infinity-domain';

export type CreateUserPersonaParams = [
  userId: string,
  userPersona: { personaId: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateUserPersona implements UseCase<
  Promise<Either<UserPersona, Error>>,
  CreateUserPersonaParams
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

  public async execute(
    userId: string,
    userPersona: { personaId: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<UserPersona, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userPersonaRepository.createUserPersona(
        userId,
        userPersona,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
