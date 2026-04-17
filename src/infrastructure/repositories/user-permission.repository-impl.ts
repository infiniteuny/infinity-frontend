import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { UserPermission } from '@app/domain/entities';
import { UserPermissionMapper } from '@app/infrastructure/dtos';
import { UserPermissionRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class UserPermissionRepositoryImpl implements UserPermissionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserPermissions(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/permissions`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPermissionsResponse = response.data.data.user_permissions.map(
        UserPermissionMapper.fromDtoToDomain,
      );

      return right(userPermissionsResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUserPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/user-permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPermissionResponse = UserPermissionMapper.fromDtoToDomain(
        response.data.data.user_permission,
      );

      return right(userPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUserPermission(
    userId: string,
    userPermission: { permissionId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/users/${userId}/permissions`,
        {
          permission_id: userPermission.permissionId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userPermissionResponse = UserPermissionMapper.fromDtoToDomain(
        response.data.data.user_permission,
      );

      return right(userPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateUserPermission(
    id: string,
    userPermission: { permissionId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/user-permissions/${id}`,
        {
          permission_id: userPermission.permissionId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userPermissionResponse = UserPermissionMapper.fromDtoToDomain(
        response.data.data.user_permission,
      );

      return right(userPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUserPermission(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/user-permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userPermissionResponse = UserPermissionMapper.fromDtoToDomain(
        response.data.data.user_permission,
      );

      return right(userPermissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
