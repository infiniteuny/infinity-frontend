import type { CompetitionTimeRangeRepository } from '@app/domain/repositories';
import {
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionTimeRangeParams = [
  filterOptions?: CompetitionTimeRangeFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionTimeRanges
  implements
    UseCase<
      Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>>,
      GetCompetitionTimeRangeParams
    >
{
  private readonly competitionTimeRangeRepository: CompetitionTimeRangeRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTimeRangeRepository)
    competitionTimeRangeRepository: CompetitionTimeRangeRepository,
  ) {
    this.competitionTimeRangeRepository = competitionTimeRangeRepository;
  }

  public async execute(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>> {
    return await this.competitionTimeRangeRepository.getCompetitionTimeRanges(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
