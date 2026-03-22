import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CommunityGroupAdminRepositoryImpl implements CommunityGroupAdminRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCommunityGroupAdmins(
    filterOptions?: CommunityGroupAdminFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/community-group-admins', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[year]': filterOptions?.year,
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

      const communityGroupAdminsResponse = response.data.data.community_group_admins.map(
        CommunityGroupAdminMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([communityGroupAdminsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/community-group-admins/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const communityGroupAdminResponse = CommunityGroupAdminMapper.fromDtoToDomain(
        response.data.data.community_group_admin,
      );

      return right(communityGroupAdminResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupAdmin(
    communityGroupAdmin: Omit<
      CommunityGroupAdmin,
      'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/community-group-admins',
        CommunityGroupAdminMapper.fromDomaintoDto(communityGroupAdmin),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const communityGroupAdminResponse = CommunityGroupAdminMapper.fromDtoToDomain(
        response.data.data.community_group_admin,
      );

      return right(communityGroupAdminResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCommunityGroupAdmin(
    id: string,
    communityGroupAdmin: Partial<
      Omit<CommunityGroupAdmin, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/community-group-admins/${id}`,
        CommunityGroupAdminMapper.fromDomaintoDto(communityGroupAdmin),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const communityGroupAdminResponse = CommunityGroupAdminMapper.fromDtoToDomain(
        response.data.data.community_group_admin,
      );

      return right(communityGroupAdminResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCommunityGroupAdmin(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/community-group-admins/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CommunityGroupAdminMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
