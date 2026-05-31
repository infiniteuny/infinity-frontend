import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionOrganizerType,
  CompetitionOrganizerTypeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionOrganizerTypeMapper } from '@app/infrastructure/dtos';
import { CompetitionOrganizerTypeRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';

@injectable()
export class CompetitionOrganizerTypeRepositoryImpl implements CompetitionOrganizerTypeRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionOrganizerTypes(
    filterOptions?: CompetitionOrganizerTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionOrganizerType[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-organizer-types', {
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
        },
      });

      const competitionOrganizerTypesResponse = response.data.data.competition_organizer_types.map(
        CompetitionOrganizerTypeMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionOrganizerTypesResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-organizer-types/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionOrganizerTypeResponse = CompetitionOrganizerTypeMapper.fromDtoToDomain(
        response.data.data.competition_organizer_type,
      );

      return right(competitionOrganizerTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionOrganizerType(
    competitionOrganizerType: Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-organizer-types',
        CompetitionOrganizerTypeMapper.fromDomainToDto(competitionOrganizerType),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionOrganizerTypeResponse = CompetitionOrganizerTypeMapper.fromDtoToDomain(
        response.data.data.competition_organizer_type,
      );

      return right(competitionOrganizerTypeResponse);
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
    token?: string,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-organizer-types/${id}`,
        CompetitionOrganizerTypeMapper.fromDomainToDto(competitionOrganizerType),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionOrganizerTypeResponse = CompetitionOrganizerTypeMapper.fromDtoToDomain(
        response.data.data.competition_organizer_type,
      );

      return right(competitionOrganizerTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(
        `/competition-organizer-types/${id}`,
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionOrganizerTypeResponse = CompetitionOrganizerTypeMapper.fromDtoToDomain(
        response.data.data.competition_organizer_type,
      );

      return right(competitionOrganizerTypeResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
