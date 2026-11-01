import type { CompetitionTimeRangeRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import {
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  CompetitionTimeRangeSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetCompetitionTimeRangesParams = [
  filterOptions?: CompetitionTimeRangeFilterOptions,
  sortOptions?: CompetitionTimeRangeSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionTimeRanges implements UseCase<
  Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>>,
  GetCompetitionTimeRangesParams
> {
  private readonly competitionTimeRangeRepository: CompetitionTimeRangeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTimeRangeRepository)
    competitionTimeRangeRepository: CompetitionTimeRangeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionTimeRangeRepository = competitionTimeRangeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    sortOptions?: CompetitionTimeRangeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionTimeRangeRepository.getCompetitionTimeRanges(
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
