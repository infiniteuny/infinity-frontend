import { UserPermission } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserPermissionRepository {
  getUserPermissions(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>>;

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

  updateUserPermission(
    id: string,
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
