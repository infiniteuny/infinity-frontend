import { GroupPermission } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface GroupPermissionRepository {
  getGroupPermissions(
    groupId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission[], Error>>;

  getGroupPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>>;

  createGroupPermission(
    groupId: string,
    groupPermission: { permissionId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>>;

  deleteGroupPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>>;
}
