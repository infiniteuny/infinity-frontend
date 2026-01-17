import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  CoreTeamDivision,
  CoreTeamDivisionFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionRepository } from '@app/domain/repositories';
import { CoreTeamDivisionMapper } from '@app/infrastructure/dtos';

export class CoreTeamDivisionRepositoryImpl implements CoreTeamDivisionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCoreTeamDivisions(
    filterOptions?: CoreTeamDivisionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/core-team-divisions', {
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
          'filters[priority]': filterOptions?.priority,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(CoreTeamDivisionMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/core-team-divisions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CoreTeamDivisionMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCoreTeamDivision(
    coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/core-team-divisions',
        CoreTeamDivisionMapper.fromDomaintoDto(coreTeamDivision),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CoreTeamDivisionMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCoreTeamDivision(
    id: string,
    coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/core-team-divisions/${id}`,
        CoreTeamDivisionMapper.fromDomaintoDto(coreTeamDivision),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CoreTeamDivisionMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCoreTeamDivision(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeamDivision, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/core-team-divisions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CoreTeamDivisionMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
