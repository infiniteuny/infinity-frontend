import type { CompetitionOutputRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionOutput,
  CompetitionOutputFilterOptions,
  CompetitionOutputSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionOutputsParams = [
  filterOptions?: CompetitionOutputFilterOptions,
  sortOptions?: CompetitionOutputSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionOutputs implements UseCase<
  Promise<Either<[CompetitionOutput[], PaginationOptions], Error>>,
  GetCompetitionOutputsParams
> {
  private readonly competitionOutputRepository: CompetitionOutputRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionOutputRepository)
    competitionOutputRepository: CompetitionOutputRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionOutputRepository = competitionOutputRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionOutputFilterOptions,
    sortOptions?: CompetitionOutputSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionOutput[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOutputRepository.getCompetitionOutputs(
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
