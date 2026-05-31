import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { CompetitionInstanceMapper } from '@app/infrastructure/dtos';
import { CompetitionInstanceRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject, injectable } from 'inversify';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';

@injectable()
export class CompetitionInstanceRepositoryImpl implements CompetitionInstanceRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getCompetitionInstances(
    includeOptions?: CompetitionInstanceIncludeOptions,
    filterOptions?: CompetitionInstanceFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionInstance[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competition-instances', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
          'filters[competition_id]': filterOptions?.competitionId,
          'filters[name]': filterOptions?.name,
          'filters[description]': filterOptions?.description,
          'filters[url]': filterOptions?.url,
          'filters[organizer]': filterOptions?.organizer,
          'filters[organizer_type_id]': filterOptions?.organizerTypeId,
          'filters[start_date]':
            filterOptions?.startDate != null
              ? (filterOptions.startDateOperator ?? '') + filterOptions.startDate.toISOString()
              : undefined,
          'filters[end_date]':
            filterOptions?.endDate != null
              ? (filterOptions.endDateOperator ?? '') + filterOptions.endDate.toISOString()
              : undefined,
          'filters[location]': filterOptions?.location,
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

      const competitionInstancesResponse = response.data.data.competition_instances.map(
        CompetitionInstanceMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([competitionInstancesResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetitionInstance(
    id: string,
    includeOptions?: CompetitionInstanceIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competition-instances/${id}`, {
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

      const competitionInstanceResponse = CompetitionInstanceMapper.fromDtoToDomain(
        response.data.data.competition_instance,
      );

      return right(competitionInstanceResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetitionInstance(
    competitionInstance: Omit<
      CompetitionInstance,
      'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>> {
    try {
      const competitionInstanceDto = CompetitionInstanceMapper.fromDomainToDto(competitionInstance);

      const response = await this.infinityApiDataSource.postForm(
        '/competition-instances',
        {
          ...competitionInstanceDto,
          logo:
            competitionInstanceDto.logo instanceof File
              ? (competitionInstanceDto.logo as File)
              : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionInstanceResponse = CompetitionInstanceMapper.fromDtoToDomain(
        response.data.data.competition_instance,
      );

      return right(competitionInstanceResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateCompetitionInstance(
    id: string,
    competitionInstance: Partial<
      Omit<CompetitionInstance, 'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'>
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>> {
    try {
      const competitionInstanceDto = CompetitionInstanceMapper.fromDomainToDto(competitionInstance);

      const response = await this.infinityApiDataSource.putForm(
        `/competition-instances/${id}`,
        {
          ...competitionInstanceDto,
          logo:
            competitionInstanceDto.logo instanceof File
              ? (competitionInstanceDto.logo as File)
              : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const competitionInstanceResponse = CompetitionInstanceMapper.fromDtoToDomain(
        response.data.data.competition_instance,
      );

      return right(competitionInstanceResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteCompetitionInstance(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competition-instances/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const competitionInstanceResponse = CompetitionInstanceMapper.fromDtoToDomain(
        response.data.data.competition_instance,
      );

      return right(competitionInstanceResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
