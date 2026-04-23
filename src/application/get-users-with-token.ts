import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetUsersWithTokenParams = [
  includeOptions?: UserIncludeOptions,
  filterOptions?: UserFilterOptions,
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
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    return await this.userRepository.getUsers(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      token,
    );
  }
}
