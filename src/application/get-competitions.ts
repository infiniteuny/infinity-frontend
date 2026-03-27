import type { CompetitionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  Competition,
  CompetitionFilterOptions,
  CompetitionIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionsParams = [
  includeOptions?: CompetitionIncludeOptions,
  filterOptions?: CompetitionFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitions implements UseCase<
  Promise<Either<[Competition[], PaginationOptions], Error>>,
  GetCompetitionsParams
> {
  private readonly competitionRepository: CompetitionRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRepository)
    competitionRepository: CompetitionRepository,
  ) {
    this.competitionRepository = competitionRepository;
  }

  public async execute(
    includeOptions?: CompetitionIncludeOptions,
    filterOptions?: CompetitionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Competition[], PaginationOptions], Error>> {
    return await this.competitionRepository.getCompetitions(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
