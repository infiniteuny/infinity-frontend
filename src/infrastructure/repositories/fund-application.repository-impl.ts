import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import {
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { FundApplicationMapper } from '@app/infrastructure/dtos';
import { FundApplicationRepository } from '@app/domain/repositories';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class FundApplicationRepositoryImpl implements FundApplicationRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getFundApplications(
    includeOptions?: FundApplicationIncludeOptions,
    filterOptions?: FundApplicationFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[FundApplication[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/fund-applications', {
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
          'filters[team_id]': filterOptions?.teamId,
          'filters[competition_instance_id]': filterOptions?.competitionInstanceId,
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
    token?: string,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/fund-applications/${id}`, {
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
    token?: string,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const fundApplicationDto = FundApplicationMapper.fromDomainToDto(fundApplication);

      const response = await this.infinityApiDataSource.postForm(
        '/fund-applications',
        {
          ...fundApplicationDto,
          letter_of_acceptance:
            fundApplicationDto.letter_of_acceptance instanceof File
              ? (fundApplicationDto.letter_of_acceptance as File)
              : undefined,
          proposal:
            fundApplicationDto.proposal instanceof File
              ? (fundApplicationDto.proposal as File)
              : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        'id' | 'createdAt' | 'updatedAt' | 'team' | 'competitionInstance' | 'competitionScale'
      >
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const fundApplicationDto = FundApplicationMapper.fromDomainToDto(fundApplication);

      const response = await this.infinityApiDataSource.putForm(
        `/fund-applications/${id}`,
        {
          ...fundApplicationDto,
          letter_of_acceptance:
            fundApplicationDto.letter_of_acceptance instanceof File
              ? (fundApplicationDto.letter_of_acceptance as File)
              : undefined,
          proposal:
            fundApplicationDto.proposal instanceof File
              ? (fundApplicationDto.proposal as File)
              : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token?: string,
  ): Promise<Either<FundApplication, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/fund-applications/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
