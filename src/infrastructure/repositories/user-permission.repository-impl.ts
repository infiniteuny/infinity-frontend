import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  PermissionSortOptions,
  UserPermission,
  UserPermissionFilterOptions,
  UserPermissionIncludeOptions,
} from '@app/domain/entities';
import { UserPermissionMapper } from '@app/infrastructure/dtos';
import { UserPermissionRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

@injectable()
export class UserPermissionRepositoryImpl implements UserPermissionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserPermissions(
    userId: string,
    includeOptions: UserPermissionIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>>;
  public async getUserPermissions(
    userId: string,
    filterOptions?: UserPermissionFilterOptions,
    sortOptions?: PermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserPermission[], PaginationOptions], Error>>;
  public async getUserPermissions(
    userId: string,
    includeOptionsOrFilterOptions?: UserPermissionIncludeOptions | UserPermissionFilterOptions,
    sortOptionsOrAbortSignal?: PermissionSortOptions | AbortSignal,
    paginationOptionsOrTokenOrAbortSignal?: PaginationOptions | AbortSignal | string,
    tokenOrAbortSignal?: AbortSignal | string,
    token?: string,
  ): Promise<Either<UserPermission[] | [UserPermission[], PaginationOptions], Error>> {
    const hasIncludeOptions = Array.isArray(includeOptionsOrFilterOptions);
    const includeOptions = hasIncludeOptions ? includeOptionsOrFilterOptions : undefined;
    const filterOptions = hasIncludeOptions
      ? undefined
      : (includeOptionsOrFilterOptions as UserPermissionFilterOptions | undefined);
    const sortOptions = hasIncludeOptions
      ? undefined
      : (sortOptionsOrAbortSignal as PermissionSortOptions | undefined);
    const paginationOptions = hasIncludeOptions
      ? undefined
      : (paginationOptionsOrTokenOrAbortSignal as PaginationOptions | undefined);
    const abortSignal = hasIncludeOptions
      ? (sortOptionsOrAbortSignal as AbortSignal | undefined)
      : (tokenOrAbortSignal as AbortSignal | undefined);
    const authToken = hasIncludeOptions
      ? (paginationOptionsOrTokenOrAbortSignal as string | undefined)
      : token;
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/permissions`, {
        signal: abortSignal,
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
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
          sorts: sortOptions
            ? Object.entries(sortOptions)
                .map((sortOption) => {
                  const prefix = sortOption[1] === 'DESC' ? '-' : '';
                  const field = sortOption[0]
                    .split(/(?=[A-Z])/)
                    .join('_')
                    .toLowerCase();
                  return prefix + field;
                })
                .join(',')
            : undefined,
        },
      });

      const userPermissionsResponse = response.data.data.user_permissions.map(
        UserPermissionMapper.fromDtoToDomain,
      );

      if (hasIncludeOptions) {
        return right(userPermissionsResponse);
      } else {
        const paginationOptionsResponse = new PaginationOptions(
          response.data.data.meta.per_page,
          paginationOptions?.cursor,
          response.data.data.meta.next_cursor ?? undefined,
          response.data.data.meta.prev_cursor ?? undefined,
        );

        return right([userPermissionsResponse, paginationOptionsResponse]);
      }
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
