import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CommunityGroup,
  CommunityGroupFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CommunityGroupRepositoryImpl implements CommunityGroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCommunityGroups(
    filterOptions?: CommunityGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CommunityGroup[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/community-groups', {
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

      const communityGroupsResponse = response.data.data.community_groups.map(
        CommunityGroupMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([communityGroupsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/community-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const communityGroupResponse = CommunityGroupMapper.fromDtoToDomain(
        response.data.data.community_group,
      );

      return right(communityGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroup(
    communityGroup: Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/community-groups',
        CommunityGroupMapper.fromDomaintoDto(communityGroup),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const communityGroupResponse = CommunityGroupMapper.fromDtoToDomain(
        response.data.data.community_group,
      );

      return right(communityGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCommunityGroup(
    id: string,
    communityGroup: Partial<Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/community-groups/${id}`,
        CommunityGroupMapper.fromDomaintoDto(communityGroup),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const communityGroupResponse = CommunityGroupMapper.fromDtoToDomain(
        response.data.data.community_group,
      );

      return right(communityGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/community-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const communityGroupResponse = CommunityGroupMapper.fromDtoToDomain(
        response.data.data.community_group,
      );

      return right(communityGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
