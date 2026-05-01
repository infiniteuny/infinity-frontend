import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionRank,
  CompetitionRankFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionRankMapper } from '@app/infrastructure/dtos';
import { CompetitionRankRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CompetitionRankRepositoryImpl implements CompetitionRankRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionRanks(
    filterOptions?: CompetitionRankFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionRank[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-ranks', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

      const competitionRanksResponse = response.data.data.competition_ranks.map(
        CompetitionRankMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionRanksResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionRank(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionRank, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-ranks/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionRankResponse = CompetitionRankMapper.fromDtoToDomain(
        response.data.data.competition_rank,
      );

      return right(competitionRankResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionRank(
    competitionRank: Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionRank, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-ranks',
        CompetitionRankMapper.fromDomainToDto(competitionRank),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionRankResponse = CompetitionRankMapper.fromDtoToDomain(
        response.data.data.competition_rank,
      );

      return right(competitionRankResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionRank(
    id: string,
    competitionRank: Partial<Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionRank, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-ranks/${id}`,
        CompetitionRankMapper.fromDomainToDto(competitionRank),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionRankResponse = CompetitionRankMapper.fromDtoToDomain(
        response.data.data.competition_rank,
      );

      return right(competitionRankResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionRank(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionRank, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-ranks/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionRankResponse = CompetitionRankMapper.fromDtoToDomain(
        response.data.data.competition_rank,
      );

      return right(competitionRankResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
