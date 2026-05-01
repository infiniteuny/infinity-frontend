import type { CompetitionRankRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionRank,
  CompetitionRankFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionRanksParams = [
  filterOptions?: CompetitionRankFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionRanks implements UseCase<
  Promise<Either<[CompetitionRank[], PaginationOptions], Error>>,
  GetCompetitionRanksParams
> {
  private readonly competitionRankRepository: CompetitionRankRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRankRepository)
    competitionRankRepository: CompetitionRankRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionRankRepository = competitionRankRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionRankFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionRank[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionRankRepository.getCompetitionRanks(
        filterOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
