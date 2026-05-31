import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { CoreTeam, CoreTeamFilterOptions, PaginationOptions } from '@app/domain/entities';
import { CoreTeamMapper } from '@app/infrastructure/dtos';
import { CoreTeamRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';

@injectable()
export class CoreTeamRepositoryImpl implements CoreTeamRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCoreTeams(
    filterOptions?: CoreTeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/core-teams', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/core-teams',
        CoreTeamMapper.fromDomainToDto(coreTeam),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/core-teams/${id}`,
        CoreTeamMapper.fromDomainToDto(coreTeam),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<CoreTeam, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/core-teams/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const coreTeamResponse = CoreTeamMapper.fromDtoToDomain(response.data.data.core_team);

      return right(coreTeamResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
