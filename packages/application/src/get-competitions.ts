import type { CompetitionRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import {
  Competition,
  CompetitionFilterOptions,
  CompetitionSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetCompetitionsParams = [
  filterOptions?: CompetitionFilterOptions,
  sortOptions?: CompetitionSortOptions,
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
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRepository)
    competitionRepository: CompetitionRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.competitionRepository = competitionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionFilterOptions,
    sortOptions?: CompetitionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Competition[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.competitionRepository.getCompetitions(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
