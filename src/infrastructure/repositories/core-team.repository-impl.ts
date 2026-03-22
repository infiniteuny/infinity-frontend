import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { CoreTeam, CoreTeamFilterOptions, PaginationOptions } from '@app/domain/entities';
import { CoreTeamMapper } from '@app/infrastructure/dtos';
import { CoreTeamRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CoreTeamRepositoryImpl implements CoreTeamRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCoreTeams(
    filterOptions?: CoreTeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/core-teams', {
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

      const coreTeamsResponse = response.data.data.core_teams.map(CoreTeamMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([coreTeamsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const coreTeamResponse = CoreTeamMapper.fromDtoToDomain(response.data.data.core_team);

      return right(coreTeamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCoreTeam(
    coreTeam: Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/core-teams',
        CoreTeamMapper.fromDomaintoDto(coreTeam),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const coreTeamResponse = CoreTeamMapper.fromDtoToDomain(response.data.data.core_team);

      return right(coreTeamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCoreTeam(
    id: string,
    coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/core-teams/${id}`,
        CoreTeamMapper.fromDomaintoDto(coreTeam),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const coreTeamResponse = CoreTeamMapper.fromDtoToDomain(response.data.data.core_team);

      return right(coreTeamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCoreTeam(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/core-teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const coreTeamResponse = CoreTeamMapper.fromDtoToDomain(response.data.data.core_team);

      return right(coreTeamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
