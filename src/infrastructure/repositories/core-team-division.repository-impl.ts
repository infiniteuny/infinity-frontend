import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CoreTeamDivision,
  CoreTeamDivisionFilterOptions,
  CoreTeamDivisionSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import { CoreTeamDivisionRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';

@injectable()
export class CoreTeamDivisionRepositoryImpl implements CoreTeamDivisionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCoreTeamDivisions(
    filterOptions?: CoreTeamDivisionFilterOptions,
    sortOptions?: CoreTeamDivisionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/core-team-divisions', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[priority]': filterOptions?.priority,
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

      const coreTeamDivisionsResponse = response.data.data.core_team_divisions.map(
        CoreTeamDivisionMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([coreTeamDivisionsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-team-divisions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const coreTeamDivisionResponse = CoreTeamDivisionMapper.fromDtoToDomain(
        response.data.data.core_team_division,
      );

      return right(coreTeamDivisionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCoreTeamDivision(
    coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/core-team-divisions',
        CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const coreTeamDivisionResponse = CoreTeamDivisionMapper.fromDtoToDomain(
        response.data.data.core_team_division,
      );

      return right(coreTeamDivisionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCoreTeamDivision(
    id: string,
    coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/core-team-divisions/${id}`,
        CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const coreTeamDivisionResponse = CoreTeamDivisionMapper.fromDtoToDomain(
        response.data.data.core_team_division,
      );

      return right(coreTeamDivisionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/core-team-divisions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const coreTeamDivisionResponse = CoreTeamDivisionMapper.fromDtoToDomain(
        response.data.data.core_team_division,
      );

      return right(coreTeamDivisionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
