import type { UserRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetUsersParams = [
  includeOptions?: UserIncludeOptions,
  filterOptions?: UserFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetUsers implements UseCase<
  Promise<Either<[User[], PaginationOptions], Error>>,
  GetUsersParams
> {
  private readonly userRepository: UserRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: UserIncludeOptions,
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.userRepository.getUsers(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
