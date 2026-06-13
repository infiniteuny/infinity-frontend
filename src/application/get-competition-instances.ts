import type { CompetitionInstanceRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceIncludeOptions,
  CompetitionInstanceSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

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
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionInstanceRepository)
    competitionInstanceRepository: CompetitionInstanceRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
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

    if (authenticate) {
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
