import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  Major,
  MajorFilterOptions,
  MajorIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { MajorMapper } from '@app/infrastructure/dtos';
import { MajorRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class MajorRepositoryImpl implements MajorRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getMajors(
    includeOptions?: MajorIncludeOptions,
    filterOptions?: MajorFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Major[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/majors', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[degree_id]': filterOptions?.degreeId,
          'filters[faculty_id]': filterOptions?.facultyId,
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
        },
      });

      const majorsResponse = response.data.data.majors.map(MajorMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([majorsResponse, paginationOptionsResponse]);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async getMajor(
    id: string,
    includeOptions?: MajorIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Major, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/majors/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
        },
      });

      const majorResponse = MajorMapper.fromDtoToDomain(response.data.data.major);

      return right(majorResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async createMajor(
    major: Omit<Major, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Major, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/majors',
        MajorMapper.fromDomainToDto(major),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const majorResponse = MajorMapper.fromDtoToDomain(response.data.data.major);

      return right(majorResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async updateMajor(
    id: string,
    major: Partial<Major>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Major, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/majors/${id}`,
        MajorMapper.fromDomainToDto(major),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const majorResponse = MajorMapper.fromDtoToDomain(response.data.data.major);

      return right(majorResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async deleteMajor(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Major, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/majors/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const majorResponse = MajorMapper.fromDtoToDomain(response.data.data.major);

      return right(majorResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }
}
