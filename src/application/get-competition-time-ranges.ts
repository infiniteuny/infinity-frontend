import type { CompetitionTimeRangeRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionTimeRangeParams = [
  filterOptions?: CompetitionTimeRangeFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitionTimeRanges implements UseCase<
  Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>>,
  GetCompetitionTimeRangeParams
> {
  private readonly competitionTimeRangeRepository: CompetitionTimeRangeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTimeRangeRepository)
    competitionTimeRangeRepository: CompetitionTimeRangeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionTimeRangeRepository = competitionTimeRangeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>> {
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

    return await this.competitionTimeRangeRepository.getCompetitionTimeRanges(
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
