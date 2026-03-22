import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';
import { CompetitionTeamTypeRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CompetitionTeamTypeRepositoryImpl implements CompetitionTeamTypeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitionTeamTypes(
    filterOptions?: CompetitionTeamTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-team-types', {
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
          'filters[weight]': filterOptions?.weight,
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

      const competitionTeamTypesResponse = response.data.data.competition_team_types.map(
        CompetitionTeamTypeMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionTeamTypesResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionTeamType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTeamType, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-team-types/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const competitionTeamTypeResponse = CompetitionTeamTypeMapper.fromDtoToDomain(
        response.data.data.competition_team_type,
      );

      return right(competitionTeamTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionTeamType(
    competitionTeamType: Omit<CompetitionTeamType, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTeamType, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-team-types',
        CompetitionTeamTypeMapper.fromDomaintoDto(competitionTeamType),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const competitionTeamTypeResponse = CompetitionTeamTypeMapper.fromDtoToDomain(
        response.data.data.competition_team_type,
      );

      return right(competitionTeamTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionTeamType(
    id: string,
    competitionTeamType: Partial<Omit<CompetitionTeamType, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTeamType, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-team-types/${id}`,
        CompetitionTeamTypeMapper.fromDomaintoDto(competitionTeamType),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const competitionTeamTypeResponse = CompetitionTeamTypeMapper.fromDtoToDomain(
        response.data.data.competition_team_type,
      );

      return right(competitionTeamTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionTeamType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTeamType, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-team-types/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const competitionTeamTypeResponse = CompetitionTeamTypeMapper.fromDtoToDomain(
        response.data.data.competition_team_type,
      );

      return right(competitionTeamTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
