import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Faculty, FacultyFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { FacultyRepository } from '@app/domain/repositories';
import { FacultyMapper } from '@app/infrastructure/dtos';

export class FacultyRepositoryImpl implements FacultyRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getFaculties(
    filterOptions?: FacultyFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/faculties', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
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
        },
      });

      const facultiesResponse = response.data.data.faculties.map(FacultyMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([facultiesResponse, paginationOptionsResponse]);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async getFaculty(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Faculty, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/faculties/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const facultyResponse = FacultyMapper.fromDtoToDomain(response.data.data.faculty);

      return right(facultyResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async createFaculty(
    faculty: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Faculty, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/faculties',
        FacultyMapper.fromDomaintoDto(faculty),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const facultyResponse = FacultyMapper.fromDtoToDomain(response.data.data.faculty);

      return right(facultyResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async updateFaculty(
    id: string,
    faculty: Partial<Faculty>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Faculty, Error>> {
    try {
      const response = await this.infinityApiDataSource.patch(
        `/faculties/${id}`,
        FacultyMapper.fromDomaintoDto(faculty),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      const facultyResponse = FacultyMapper.fromDtoToDomain(response.data.data.faculty);

      return right(facultyResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }

  public async deleteFaculty(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Faculty, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/faculties/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const facultyResponse = FacultyMapper.fromDtoToDomain(response.data.data.faculty);

      return right(facultyResponse);
    } catch (error) {
      const response = handleAxiosError(error);

      return left(response);
    }
  }
}
