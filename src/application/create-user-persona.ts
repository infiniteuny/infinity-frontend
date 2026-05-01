import type { UserPersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { UserPersona } from '@app/domain/entities';

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
