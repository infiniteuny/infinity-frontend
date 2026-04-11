import type { CompetitionRankRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionRank,
  CompetitionRankFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, match } from 'effect/Either';
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
export class GetCompetitionRanks implements UseCase<
  Promise<Either<[CompetitionRank[], PaginationOptions], Error>>,
  GetCompetitionRankParams
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
    authenticate?: boolean,
  ): Promise<Either<[CompetitionRank[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.competitionRankRepository.getCompetitionRanks(
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
