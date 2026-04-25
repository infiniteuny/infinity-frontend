import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { GroupPermission } from '@app/domain/entities';
import { GroupPermissionMapper } from '@app/infrastructure/dtos';
import { GroupPermissionRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class GroupPermissionRepositoryImpl implements GroupPermissionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getGroupPermissions(
    groupId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/groups/${groupId}/permissions`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const groupPermissionsResponse = response.data.data.group_permissions.map(
        GroupPermissionMapper.fromDtoToDomain,
      );

      return right(groupPermissionsResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getGroupPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/group-permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const groupPermissionResponse = GroupPermissionMapper.fromDtoToDomain(
        response.data.data.group_permission,
      );

      return right(groupPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createGroupPermission(
    groupId: string,
    groupPermission: { permissionId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/groups/${groupId}/permissions`,
        {
          permission_id: groupPermission.permissionId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const groupPermissionResponse = GroupPermissionMapper.fromDtoToDomain(
        response.data.data.group_permission,
      );

      return right(groupPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteGroupPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<GroupPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/group-permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const groupPermissionResponse = GroupPermissionMapper.fromDtoToDomain(
        response.data.data.group_permission,
      );

      return right(groupPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
