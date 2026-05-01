import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import { CompetitionTimeRangeRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CompetitionTimeRangeRepositoryImpl implements CompetitionTimeRangeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionTimeRanges(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-time-ranges', {
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

      const competitionTimeRangesResponse = response.data.data.competition_time_ranges.map(
        CompetitionTimeRangeMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionTimeRangesResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-time-ranges/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionTimeRangeResponse = CompetitionTimeRangeMapper.fromDtoToDomain(
        response.data.data.competition_time_range,
      );

      return right(competitionTimeRangeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionTimeRange(
    competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-time-ranges',
        CompetitionTimeRangeMapper.fromDomainToDto(competitionTimeRange),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionTimeRangeResponse = CompetitionTimeRangeMapper.fromDtoToDomain(
        response.data.data.competition_time_range,
      );

      return right(competitionTimeRangeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionTimeRange(
    id: string,
    competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-time-ranges/${id}`,
        CompetitionTimeRangeMapper.fromDomainToDto(competitionTimeRange),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionTimeRangeResponse = CompetitionTimeRangeMapper.fromDtoToDomain(
        response.data.data.competition_time_range,
      );

      return right(competitionTimeRangeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-time-ranges/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionTimeRangeResponse = CompetitionTimeRangeMapper.fromDtoToDomain(
        response.data.data.competition_time_range,
      );

      return right(competitionTimeRangeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
