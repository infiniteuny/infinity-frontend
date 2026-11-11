import type { UserRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
  UserSortOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetUsersParams = [
  includeOptions?: UserIncludeOptions,
  filterOptions?: UserFilterOptions,
  sortOptions?: UserSortOptions,
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
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: UserIncludeOptions,
    filterOptions?: UserFilterOptions,
    sortOptions?: UserSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.userRepository.getUsers(
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
