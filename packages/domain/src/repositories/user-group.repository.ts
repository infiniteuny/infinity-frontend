import {
  GroupSortOptions,
  PaginationOptions,
  UserGroup,
  UserGroupFilterOptions,
} from '../entities';
import { Either } from 'effect/Either';

export interface UserGroupRepository {
  getUserGroups(
    userId: string,
    filterOptions?: UserGroupFilterOptions,
    sortOptions?: GroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserGroup[], PaginationOptions], Error>>;

  getUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;

  createUserGroup(
    userId: string,
    userGroup: { groupId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;

  deleteUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;
}
