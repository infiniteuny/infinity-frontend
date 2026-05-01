import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  UserCommunityGroup,
  UserCommunityGroupFilterOptions,
} from '@app/domain/entities';
import { UserCommunityGroupMapper } from '@app/infrastructure/dtos';
import { UserCommunityGroupRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class UserCommunityGroupRepositoryImpl implements UserCommunityGroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserCommunityGroups(
    userId: string,
    filterOptions?: UserCommunityGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserCommunityGroup[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/community-groups`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[priority]': filterOptions?.priority,
          'filters[description]': filterOptions?.description,
          'filters[is_active]': filterOptions?.isActive,
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

      const userCommunityGroupsResponse = response.data.data.user_community_groups.map(
        UserCommunityGroupMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([userCommunityGroupsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
