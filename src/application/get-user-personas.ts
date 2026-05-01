import type { UserPersonaRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { PaginationOptions, UserPersona, UserPersonaFilterOptions } from '@app/domain/entities';

export type GetUserPersonasParams = [
  userId: string,
  filterOptions?: UserPersonaFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetUserPersonas implements UseCase<
  Promise<Either<[UserPersona[], PaginationOptions], Error>>,
  GetUserPersonasParams
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
    filterOptions?: UserPersonaFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[UserPersona[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.userPersonaRepository.getUserPersonas(
      userId,
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
