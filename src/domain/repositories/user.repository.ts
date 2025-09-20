import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserRepository {
  getUsers(
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    authenticate?: boolean,
  ): Promise<Either<[User[], PaginationOptions], Error>>;
}
