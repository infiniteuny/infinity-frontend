import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { CompetitionMapper } from '@app/infrastructure/dtos';
import { CompetitionRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  Competition,
  CompetitionFilterOptions,
  CompetitionIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';

export class CompetitionRepositoryImpl implements CompetitionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitions(
    includeOptions?: CompetitionIncludeOptions,
    filterOptions?: CompetitionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Competition[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/competitions', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
          'filters[name]': filterOptions?.name,
          'filters[description]': filterOptions?.description,
          'filters[url]': filterOptions?.url,
          'filters[organizer]': filterOptions?.organizer,
          'filters[organizer_type_id]': filterOptions?.organizerTypeId,
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
    includeOptions?: CompetitionIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/competitions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
        },
      });

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createCompetition(
    competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'organizerType'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/competitions',
        CompetitionMapper.fromDomaintoDto(competition),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
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
    competition: Partial<Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'organizerType'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/competitions/${id}`,
        CompetitionMapper.fromDomaintoDto(competition),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
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
    authenticate: boolean = true,
  ): Promise<Either<Competition, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/competitions/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      const competitionResponse = CompetitionMapper.fromDtoToDomain(response.data.data.competition);

      return right(competitionResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
