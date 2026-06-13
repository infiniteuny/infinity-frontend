import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import {
  Degree,
  DegreeFilterOptions,
  DegreeSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { DegreeMapper } from '@app/infrastructure/dtos';
import { DegreeRepository } from '@app/domain/repositories';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';

@injectable()
export class DegreeRepositoryImpl implements DegreeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getDegrees(
    filterOptions?: DegreeFilterOptions,
    sortOptions?: DegreeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Degree[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/degrees', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[code]': filterOptions?.code,
          'filters[name]': filterOptions?.name,
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

      const degreesResponse = response.data.data.degrees.map(DegreeMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([degreesResponse, paginationOptionsResponse]);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async getDegree(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/degrees/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const degreeResponse = DegreeMapper.fromDtoToDomain(response.data.data.degree);

      return right(degreeResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async createDegree(
    degree: Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/degrees',
        DegreeMapper.fromDomainToDto(degree),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const degreeResponse = DegreeMapper.fromDtoToDomain(response.data.data.degree);

      return right(degreeResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async updateDegree(
    id: string,
    degree: Partial<Degree>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/degrees/${id}`,
        DegreeMapper.fromDomainToDto(degree),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const degreeResponse = DegreeMapper.fromDtoToDomain(response.data.data.degree);

      return right(degreeResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async deleteDegree(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/degrees/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const degreeResponse = DegreeMapper.fromDtoToDomain(response.data.data.degree);

      return right(degreeResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }
}
