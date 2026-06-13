import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionScale,
  CompetitionScaleFilterOptions,
  CompetitionScaleSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionScaleMapper } from '@app/infrastructure/dtos';
import { CompetitionScaleRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';

@injectable()
export class CompetitionScaleRepositoryImpl implements CompetitionScaleRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionScales(
    filterOptions?: CompetitionScaleFilterOptions,
    sortOptions?: CompetitionScaleSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-scales', {
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
          sorts: sortOptions
            ? Object.entries(sortOptions)
                .map((sortOption) => {
                  const prefix = sortOption[1] === 'DESC' ? '-' : '';
                  const field = sortOption[0]
                    .split(/(?=[A-Z])/)
                    .join('_')
                    .toLowerCase();
                  return prefix + field;
                })
                .join(',')
            : undefined,
        },
      });

      const competitionScalesResponse = response.data.data.competition_scales.map(
        CompetitionScaleMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionScalesResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-scales/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionScaleResponse = CompetitionScaleMapper.fromDtoToDomain(
        response.data.data.competition_scale,
      );

      return right(competitionScaleResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionScale(
    competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-scales',
        CompetitionScaleMapper.fromDomainToDto(competitionScale),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionScaleResponse = CompetitionScaleMapper.fromDtoToDomain(
        response.data.data.competition_scale,
      );

      return right(competitionScaleResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionScale(
    id: string,
    competitionScale: Partial<Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-scales/${id}`,
        CompetitionScaleMapper.fromDomainToDto(competitionScale),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionScaleResponse = CompetitionScaleMapper.fromDtoToDomain(
        response.data.data.competition_scale,
      );

      return right(competitionScaleResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-scales/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionScaleResponse = CompetitionScaleMapper.fromDtoToDomain(
        response.data.data.competition_scale,
      );

      return right(competitionScaleResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
