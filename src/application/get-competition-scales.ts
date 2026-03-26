import type { CompetitionScaleRepository } from '@app/domain/repositories';
import {
  CompetitionScale,
  CompetitionScaleFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionScaleParams = [
  filterOptions?: CompetitionScaleFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionScales
  implements
    UseCase<
      Promise<Either<[CompetitionScale[], PaginationOptions], Error>>,
      GetCompetitionScaleParams
    >
{
  private readonly competitionScaleRepository: CompetitionScaleRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionScaleRepository)
    competitionScaleRepository: CompetitionScaleRepository,
  ) {
    this.competitionScaleRepository = competitionScaleRepository;
  }

  public async execute(
    filterOptions?: CompetitionScaleFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>> {
    return await this.competitionScaleRepository.getCompetitionScales(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
