import type {
  AchievementLeaderboardRepository,
  AuthRepository,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import {
  AchievementLeaderboard,
  AchievementLeaderboardFilterOptions,
  AchievementLeaderboardIncludeOptions,
  AchievementLeaderboardSortOptions,
  PaginationOptions,
  SYMBOLS,
} from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetAchievementLeaderboardsParams = [
  year: number,
  includeOptions?: AchievementLeaderboardIncludeOptions,
  filterOptions?: AchievementLeaderboardFilterOptions,
  sortOptions?: AchievementLeaderboardSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetAchievementLeaderboards implements UseCase<
  Promise<Either<[AchievementLeaderboard[], PaginationOptions], Error>>,
  GetAchievementLeaderboardsParams
> {
  private readonly achievementLeaderboardRepository: AchievementLeaderboardRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AchievementLeaderboardRepository)
    achievementLeaderboardRepository: AchievementLeaderboardRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.achievementLeaderboardRepository = achievementLeaderboardRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    year: number,
    includeOptions?: AchievementLeaderboardIncludeOptions,
    filterOptions?: AchievementLeaderboardFilterOptions,
    sortOptions?: AchievementLeaderboardSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[AchievementLeaderboard[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.achievementLeaderboardRepository.getAchievementLeaderboards(
      year,
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
