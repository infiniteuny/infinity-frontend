import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  CompetitionOrganizerType,
  CompetitionOrganizerTypeFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CompetitionOrganizerTypeRepository } from '@app/domain/repositories';
import { CompetitionOrganizerTypeMapper } from '@app/infrastructure/dtos';

export class CompetitionOrganizerTypeRepositoryImpl implements CompetitionOrganizerTypeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitionOrganizerTypes(
    filterOptions?: CompetitionOrganizerTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CompetitionOrganizerType[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-organizer-types', {
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
        response.data.data.map(CompetitionOrganizerTypeMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-organizer-types/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(CompetitionOrganizerTypeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionOrganizerType(
    competitionOrganizerType: Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-organizer-types',
        CompetitionOrganizerTypeMapper.fromDomaintoDto(competitionOrganizerType),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionOrganizerTypeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionOrganizerType(
    id: string,
    competitionOrganizerType: Partial<
      Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-organizer-types/${id}`,
        CompetitionOrganizerTypeMapper.fromDomaintoDto(competitionOrganizerType),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionOrganizerTypeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(
        `/competition-organizer-types/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(CompetitionOrganizerTypeMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
