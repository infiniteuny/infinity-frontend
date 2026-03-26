import type { CompetitionOutputRepository } from '@app/domain/repositories';
import {
  CompetitionOutput,
  CompetitionOutputFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionOutputParams = [
  filterOptions?: CompetitionOutputFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionOutputs
  implements
    UseCase<
      Promise<Either<[CompetitionOutput[], PaginationOptions], Error>>,
      GetCompetitionOutputParams
    >
{
  private readonly competitionOutputRepository: CompetitionOutputRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionOutputRepository)
    competitionOutputRepository: CompetitionOutputRepository,
  ) {
    this.competitionOutputRepository = competitionOutputRepository;
  }

  public async execute(
    filterOptions?: CompetitionOutputFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionOutput[], PaginationOptions], Error>> {
    return await this.competitionOutputRepository.getCompetitionOutputs(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
