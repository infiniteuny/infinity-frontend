import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  FundApplication,
  FundApplicationFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { FundApplicationRepository } from '@app/domain/repositories';
import { FundApplicationMapper } from '@app/infrastructure/dtos';
import { DateTime } from 'luxon';

export class FundApplicationRepositoryImpl implements FundApplicationRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getFundApplications(
    filterOptions?: FundApplicationFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[FundApplication[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/fund-applications', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[team_id]': filterOptions?.teamId,
          'filters[competition_id]': filterOptions?.competitionId,
          'filters[competition_team_type_id]': filterOptions?.competitionTeamTypeId,
          'filters[competition_scale_id]': filterOptions?.competitionScaleId,
          'filters[competition_branch]': filterOptions?.competitionBranch,
          'filters[competition_start_date][operator]': filterOptions?.competitionStartDateOperator,
          'filters[competition_start_date][value]': filterOptions?.competitionStartDate
            ? DateTime.fromJSDate(filterOptions.competitionStartDate).toISODate()
            : undefined,
          'filters[competition_end_date][operator]': filterOptions?.competitionEndDateOperator,
          'filters[competition_end_date][value]': filterOptions?.competitionEndDate
            ? DateTime.fromJSDate(filterOptions.competitionEndDate).toISODate()
            : undefined,
          'filters[status]': filterOptions?.status,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(FundApplicationMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getFundApplication(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/fund-applications/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(FundApplicationMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createFundApplication(
    fundApplication: Omit<
      FundApplication,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competition'
      | 'competitionTeamType'
      | 'competitionScale'
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/fund-applications',
        FundApplicationMapper.fromDomaintoDto(fundApplication),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(FundApplicationMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateFundApplication(
    id: string,
    fundApplication: Partial<
      Omit<
        FundApplication,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'team'
        | 'competition'
        | 'competitionTeamType'
        | 'competitionScale'
      >
    >,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/fund-applications/${id}`,
        FundApplicationMapper.fromDomaintoDto(fundApplication),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(FundApplicationMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteFundApplication(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/fund-applications/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(FundApplicationMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
