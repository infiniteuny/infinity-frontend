import {
  PaginationOptions,
  User,
  UserFilterOptions,
  UserIncludeOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserRepository {
  getUsers(
    includeOptions?: UserIncludeOptions,
    filterOptions?: UserFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[User[], PaginationOptions], Error>>;

  getUser(
    id: string,
    includeOptions?: UserIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>>;

  createUser(
    user: PartialBy<
      Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
      'startDate' | 'endDate'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>>;

  updateUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<User, Error>>;

  deleteUser(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<User, Error>>;
}
