import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  CompetitionScale,
  CompetitionScaleFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CompetitionScaleRepository } from '@app/domain/repositories';
import { CompetitionScaleMapper } from '@app/infrastructure/dtos';

export class CompetitionScaleRepositoryImpl implements CompetitionScaleRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitionScales(
    filterOptions?: CompetitionScaleFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-scales', {
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
        response.data.data.map(CompetitionScaleMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-scales/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CompetitionScaleMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionScale(
    competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-scales',
        CompetitionScaleMapper.fromDomaintoDto(competitionScale),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionScaleMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionScale(
    id: string,
    competitionScale: Partial<Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-scales/${id}`,
        CompetitionScaleMapper.fromDomaintoDto(competitionScale),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionScaleMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-scales/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CompetitionScaleMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
