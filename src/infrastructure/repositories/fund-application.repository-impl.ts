import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import {
  PaginationOptions,
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { FundApplicationRepository } from '@app/domain/repositories';
import { FundApplicationMapper } from '@app/infrastructure/dtos';

export class FundApplicationRepositoryImpl implements FundApplicationRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getFundApplications(
    includeOptions?: FundApplicationIncludeOptions,
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
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
          'filters[team_id]': filterOptions?.teamId,
          'filters[competition_id]': filterOptions?.competitionId,
          'filters[competition_scale_id]': filterOptions?.competitionScaleId,
          'filters[competition_branch]': filterOptions?.competitionBranch,
          'filters[competition_start_date]':
            filterOptions?.competitionStartDate != null
              ? (filterOptions.competitionStartDateOperator ?? '') +
                filterOptions.competitionStartDate.toISOString()
              : undefined,
          'filters[competition_end_date]':
            filterOptions?.competitionEndDate != null
              ? (filterOptions.competitionEndDateOperator ?? '') +
                filterOptions.competitionEndDate.toISOString()
              : undefined,
          'filters[status]': filterOptions?.status,
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

      const fundApplicationsResponse = response.data.data.fund_applications.map(
        FundApplicationMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([fundApplicationsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getFundApplication(
    id: string,
    includeOptions?: FundApplicationIncludeOptions,
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
        params: {
          includes: includeOptions
            ?.filter((value, index, self) => self.indexOf(value) === index)
            .join(','),
        },
      });

      const fundApplicationResponse = FundApplicationMapper.fromDtoToDomain(
        response.data.data.fund_application,
      );

      return right(fundApplicationResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createFundApplication(
    fundApplication: Omit<
      FundApplication,
      'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
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

      const fundApplicationResponse = FundApplicationMapper.fromDtoToDomain(
        response.data.data.fund_application,
      );

      return right(fundApplicationResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateFundApplication(
    id: string,
    fundApplication: Partial<
      Omit<
        FundApplication,
        'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
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

      const fundApplicationResponse = FundApplicationMapper.fromDtoToDomain(
        response.data.data.fund_application,
      );

      return right(fundApplicationResponse);
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

      const fundApplicationResponse = FundApplicationMapper.fromDtoToDomain(
        response.data.data.fund_application,
      );

      return right(fundApplicationResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
