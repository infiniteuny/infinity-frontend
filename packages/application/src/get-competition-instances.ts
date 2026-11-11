import type { CompetitionInstanceRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceIncludeOptions,
  CompetitionInstanceSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetCompetitionInstancesParams = [
  includeOptions?: CompetitionInstanceIncludeOptions,
  filterOptions?: CompetitionInstanceFilterOptions,
  sortOptions?: CompetitionInstanceSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionInstances implements UseCase<
  Promise<Either<[CompetitionInstance[], PaginationOptions], Error>>,
  GetCompetitionInstancesParams
> {
  private readonly competitionInstanceRepository: CompetitionInstanceRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionInstanceRepository)
    competitionInstanceRepository: CompetitionInstanceRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.competitionInstanceRepository = competitionInstanceRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: CompetitionInstanceIncludeOptions,
    filterOptions?: CompetitionInstanceFilterOptions,
    sortOptions?: CompetitionInstanceSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CompetitionInstance[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.competitionInstanceRepository.getCompetitionInstances(
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
