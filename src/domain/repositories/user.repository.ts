import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserRepository {
  getUsers(
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[User[], PaginationOptions], Error>>;
}
