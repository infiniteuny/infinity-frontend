import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { CompetitionMapper } from '@app/infrastructure/dtos';
import { CompetitionRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  Competition,
  CompetitionFilterOptions,
  CompetitionSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';

@injectable()
export class CompetitionRepositoryImpl implements CompetitionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitions(
    filterOptions?: CompetitionFilterOptions,
    sortOptions?: CompetitionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Competition[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competitions', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[description]': filterOptions?.description,
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

      const competitionsResponse = response.data.data.competitions.map(
        CompetitionMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetition(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competitions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetition(
    competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competitions',
        CompetitionMapper.fromDomainToDto(competition),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetition(
    id: string,
    competition: Partial<Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competitions/${id}`,
        CompetitionMapper.fromDomainToDto(competition),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetition(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competitions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
