import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeRepository } from '@app/domain/repositories';
import { CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';

export class CompetitionTimeRangeRepositoryImpl implements CompetitionTimeRangeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitionTimeRanges(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-time-ranges', {
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
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(CompetitionTimeRangeMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-time-ranges/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CompetitionTimeRangeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionTimeRange(
    competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-time-ranges',
        CompetitionTimeRangeMapper.fromDomaintoDto(competitionTimeRange),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionTimeRangeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionTimeRange(
    id: string,
    competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-time-ranges/${id}`,
        CompetitionTimeRangeMapper.fromDomaintoDto(competitionTimeRange),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionTimeRangeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-time-ranges/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CompetitionTimeRangeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
