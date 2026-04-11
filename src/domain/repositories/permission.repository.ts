import { PaginationOptions, Permission, PermissionFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface PermissionRepository {
  getPermissions(
    filterOptions?: PermissionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Permission[], PaginationOptions], Error>>;

  getPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Permission, Error>>;

  createPermission(
    permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Permission, Error>>;

  updatePermission(
    id: string,
    permission: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Permission, Error>>;

  deletePermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Permission, Error>>;
}
