import { Either } from 'effect/Either';
import {
  PaginationOptions,
  Achievement,
  AchievementFilterOptions,
  AchievementIncludeOptions,
} from '@app/domain/entities';

export interface AchievementRepository {
  getAchievements(
    includeOptions?: AchievementIncludeOptions,
    filterOptions?: AchievementFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>>;

  getAchievement(
    id: string,
    includeOptions?: AchievementIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Achievement, Error>>;

  createAchievement(
    achievement: Omit<
      Achievement,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competition'
      | 'competitionScale'
      | 'competitionTimeRange'
      | 'competitionOutput'
      | 'competitionRank'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Achievement, Error>>;

  updateAchievement(
    id: string,
    achievement: Partial<
      Omit<
        Achievement,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'team'
        | 'competition'
        | 'competitionScale'
        | 'competitionTimeRange'
        | 'competitionOutput'
        | 'competitionRank'
      >
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Achievement, Error>>;

  deleteAchievement(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Achievement, Error>>;
}
