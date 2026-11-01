import type { UserRepository } from '@infiniteuny/infinity-domain';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
  UserSortOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetUsersWithTokenParams = [
  includeOptions?: UserIncludeOptions,
  filterOptions?: UserFilterOptions,
  sortOptions?: UserSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  token?: string,
];

@injectable()
export class GetUsersWithToken implements UseCase<
  Promise<Either<[User[], PaginationOptions], Error>>,
  GetUsersWithTokenParams
> {
  private readonly userRepository: UserRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(
    includeOptions?: UserIncludeOptions,
    filterOptions?: UserFilterOptions,
    sortOptions?: UserSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    return await this.userRepository.getUsers(
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      token,
    );
  }
}
