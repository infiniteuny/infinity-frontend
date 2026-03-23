import type { CompetitionTeamTypeRepository } from '@app/domain/repositories';
import {
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionTeamTypeParams = [
  filterOptions?: CompetitionTeamTypeFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionTeamTypes
  implements
    UseCase<
      Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>>,
      GetCompetitionTeamTypeParams
    >
{
  private readonly competitionTeamTypeRepository: CompetitionTeamTypeRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTeamTypeRepository)
    competitionTeamTypeRepository: CompetitionTeamTypeRepository,
  ) {
    this.competitionTeamTypeRepository = competitionTeamTypeRepository;
  }

  public async execute(
    filterOptions?: CompetitionTeamTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>> {
    return await this.competitionTeamTypeRepository.getCompetitionTeamTypes(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
