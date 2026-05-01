import type { FundApplicationRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
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
];

@injectable()
export class GetFundApplications implements UseCase<
  Promise<Either<[FundApplication[], PaginationOptions], Error>>,
  GetFundApplicationsParams
> {
  private readonly fundApplicationRepository: FundApplicationRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: FundApplicationIncludeOptions,
    filterOptions?: FundApplicationFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[FundApplication[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.fundApplicationRepository.getFundApplications(
        includeOptions,
        filterOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
