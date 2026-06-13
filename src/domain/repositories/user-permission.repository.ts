import {
  PaginationOptions,
  PermissionSortOptions,
  UserPermission,
  UserPermissionFilterOptions,
  UserPermissionIncludeOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserPermissionRepository {
  getUserPermissions(
    userId: string,
    includeOptions: UserPermissionIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>>;

  getUserPermissions(
    userId: string,
    filterOptions?: UserPermissionFilterOptions,
    sortOptions?: PermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserPermission[], PaginationOptions], Error>>;

  getUserPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>>;

  createUserPermission(
    userId: string,
    userPermission: { permissionId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>>;

  deleteUserPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>>;
}
