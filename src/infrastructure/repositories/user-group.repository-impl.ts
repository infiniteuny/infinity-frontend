import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, UserGroup, UserGroupFilterOptions } from '@app/domain/entities';
import { UserGroupMapper } from '@app/infrastructure/dtos';
import { UserGroupRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class UserGroupRepositoryImpl implements UserGroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserGroups(
    userId: string,
    filterOptions?: UserGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserGroup[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/groups`, {
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

      const userGroupsResponse = response.data.data.user_groups.map(
        UserGroupMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([userGroupsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/user-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUserGroup(
    userId: string,
    userGroup: { groupId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/users/${userId}/groups`,
        {
          group_id: userGroup.groupId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/user-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
