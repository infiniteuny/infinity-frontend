import type { FundApplicationRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetFundApplicationsParams = [
  includeOptions?: FundApplicationIncludeOptions,
  filterOptions?: FundApplicationFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetFundApplications implements UseCase<
  Promise<Either<[FundApplication[], PaginationOptions], Error>>,
  GetFundApplicationsParams
> {
  private readonly fundApplicationRepository: FundApplicationRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
  }

  public async execute(
    includeOptions?: FundApplicationIncludeOptions,
    filterOptions?: FundApplicationFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[FundApplication[], PaginationOptions], Error>> {
    return await this.fundApplicationRepository.getFundApplications(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
