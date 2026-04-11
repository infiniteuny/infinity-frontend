import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  CompetitionOutput,
  CompetitionOutputFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { CompetitionOutputMapper } from '@app/infrastructure/dtos';
import { CompetitionOutputRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class CompetitionOutputRepositoryImpl implements CompetitionOutputRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionOutputs(
    filterOptions?: CompetitionOutputFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionOutput[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-outputs', {
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

      const competitionOutputsResponse = response.data.data.competition_outputs.map(
        CompetitionOutputMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionOutputsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-outputs/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionOutputResponse = CompetitionOutputMapper.fromDtoToDomain(
        response.data.data.competition_output,
      );

      return right(competitionOutputResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionOutput(
    competitionOutput: Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competition-outputs',
        CompetitionOutputMapper.fromDomaintoDto(competitionOutput),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionOutputResponse = CompetitionOutputMapper.fromDtoToDomain(
        response.data.data.competition_output,
      );

      return right(competitionOutputResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionOutput(
    id: string,
    competitionOutput: Partial<Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competition-outputs/${id}`,
        CompetitionOutputMapper.fromDomaintoDto(competitionOutput),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionOutputResponse = CompetitionOutputMapper.fromDtoToDomain(
        response.data.data.competition_output,
      );

      return right(competitionOutputResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-outputs/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionOutputResponse = CompetitionOutputMapper.fromDtoToDomain(
        response.data.data.competition_output,
      );

      return right(competitionOutputResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
