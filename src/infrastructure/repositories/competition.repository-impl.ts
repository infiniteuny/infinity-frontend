import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Competition, CompetitionFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { CompetitionRepository } from '@app/domain/repositories';
import { CompetitionMapper } from '@app/infrastructure/dtos';

export class CompetitionRepositoryImpl implements CompetitionRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getCompetitions(
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
          'filters[name]': filterOptions?.name,
          'filters[description]': filterOptions?.description,
          'filters[url]': filterOptions?.url,
          'filters[organizer]': filterOptions?.organizer,
          'filters[organizer_type_id]': filterOptions?.organizerTypeId,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(CompetitionMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getCompetition(
    id: string,
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
      });

      return right(CompetitionMapper.fromDtoToDomain(response.data.data));
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

      return right(CompetitionMapper.fromDtoToDomain(response.data.data));
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

      return right(CompetitionMapper.fromDtoToDomain(response.data.data));
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

      return right(CompetitionMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
