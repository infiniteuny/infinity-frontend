import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  GroupPermission,
  GroupPermissionFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { GroupPermissionMapper } from '@app/infrastructure/dtos';
import { GroupPermissionRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class GroupPermissionRepositoryImpl implements GroupPermissionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getGroupPermissions(
    groupId: string,
    filterOptions?: GroupPermissionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[GroupPermission[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/groups/${groupId}/permissions`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[guard_name]': filterOptions?.guardName,
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
              : undefined,
        },
      });

      const groupPermissionsResponse = response.data.data.group_permissions.map(
        GroupPermissionMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([groupPermissionsResponse, paginationOptionsResponse]);
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
