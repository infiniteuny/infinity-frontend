import type { CompetitionTimeRangeRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  CompetitionTimeRangeSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

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
