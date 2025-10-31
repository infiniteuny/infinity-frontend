import { PaginationOptions, User, UserFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserRepository {
  getUsers(
    includeOptions?: ('major' | 'personas' | 'groups' | 'permissions')[],
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[User[], PaginationOptions], Error>>;

  getUser(
    id: string,
    includeOptions?: ('major' | 'personas' | 'groups' | 'permissions')[],
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>>;

  createUser(
    user: PartialBy<Omit<User, 'id' | 'createdAt' | 'updatedAt'>, 'startDate' | 'endDate'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>>;

  updateUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>>;

  deleteUser(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<User, Error>>;
}
