import { Either } from 'effect/Either';
import {
  AchievementLeaderboard,
  AchievementLeaderboardFilterOptions,
  AchievementLeaderboardIncludeOptions,
  AchievementLeaderboardSortOptions,
  PaginationOptions,
} from '../entities';

export interface AchievementLeaderboardRepository {
  getAchievementLeaderboardYears(
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[number[], PaginationOptions], Error>>;

  getAchievementLeaderboards(
    year: number,
    includeOptions?: AchievementLeaderboardIncludeOptions,
    filterOptions?: AchievementLeaderboardFilterOptions,
    sortOptions?: AchievementLeaderboardSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[AchievementLeaderboard[], PaginationOptions], Error>>;
}
