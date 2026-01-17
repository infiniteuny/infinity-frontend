import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, CommunityGroupAdmin } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { CommunityGroupAdminMapper } from '@app/infrastructure/dtos';

export class CommunityGroupAdminRepositoryImpl implements CommunityGroupAdminRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCommunityGroupAdmins(
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
        },
      });

      return right([
        response.data.data.map(CommunityGroupAdminMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
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

      return right(CommunityGroupAdminMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCommunityGroupAdmin(
    communityGroupAdmin: Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt'>,
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

      return right(CommunityGroupAdminMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCommunityGroupAdmin(
    id: string,
    communityGroupAdmin: Partial<Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt'>>,
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

      return right(CommunityGroupAdminMapper.fromDtoToDomain(response.data.data));
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
