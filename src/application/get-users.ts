import type { UserRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetUsersParams = [
  filterOptions?: UserFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetUsers
  implements UseCase<Promise<Either<[User[], PaginationOptions], Error>>, GetUsersParams>
{
  private readonly userRepository: UserRepository;

  public constructor(
    @inject(SYMBOLS.UserRepository)
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async execute(
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[User[], PaginationOptions], Error>> {
    return await this.userRepository.getUsers(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
