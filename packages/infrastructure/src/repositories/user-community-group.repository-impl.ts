import type { InfinityApiDataSource } from '../datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@infiniteuny/infinity-utils';
import { inject, injectable } from 'inversify';
import {
  CommunityGroupSortOptions,
  PaginationOptions,
  UserCommunityGroup,
  UserCommunityGroupFilterOptions,
} from '@infiniteuny/infinity-domain';
import { UserCommunityGroupMapper } from '../dtos';
import { UserCommunityGroupRepository } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';

@injectable()
export class UserCommunityGroupRepositoryImpl implements UserCommunityGroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserCommunityGroups(
    userId: string,
    filterOptions?: UserCommunityGroupFilterOptions,
    sortOptions?: CommunityGroupSortOptions,
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
