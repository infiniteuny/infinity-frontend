import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Permission, PermissionFilterOptions } from '@app/domain/entities';
import { PermissionMapper } from '@app/infrastructure/dtos';
import { PermissionRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class PermissionRepositoryImpl implements PermissionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getPermissions(
    filterOptions?: PermissionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Permission[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/permissions', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
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

      const permissionsResponse = response.data.data.permissions.map(
        PermissionMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([permissionsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getPermission(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Permission, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const permissionResponse = PermissionMapper.fromDtoToDomain(response.data.data.permission);

      return right(permissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createPermission(
    permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Permission, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/permissions',
        PermissionMapper.fromDomaintoDto(permission),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const permissionResponse = PermissionMapper.fromDtoToDomain(response.data.data.permission);

      return right(permissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updatePermission(
    id: string,
    permission: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Permission, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/permissions/${id}`,
        PermissionMapper.fromDomaintoDto(permission),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const permissionResponse = PermissionMapper.fromDtoToDomain(response.data.data.permission);

      return right(permissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deletePermission(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Permission, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/permissions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const permissionResponse = PermissionMapper.fromDtoToDomain(response.data.data.permission);

      return right(permissionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
