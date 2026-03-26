import type { CompetitionRankRepository } from '@app/domain/repositories';
import {
  CompetitionRank,
  CompetitionRankFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionRankParams = [
  filterOptions?: CompetitionRankFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionRanks
  implements
    UseCase<
      Promise<Either<[CompetitionRank[], PaginationOptions], Error>>,
      GetCompetitionRankParams
    >
{
  private readonly competitionRankRepository: CompetitionRankRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRankRepository)
    competitionRankRepository: CompetitionRankRepository,
  ) {
    this.competitionRankRepository = competitionRankRepository;
  }

  public async execute(
    filterOptions?: CompetitionRankFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionRank[], PaginationOptions], Error>> {
    return await this.competitionRankRepository.getCompetitionRanks(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
