import { Either } from 'effect/Either';
import { PaginationOptions, Achievement, AchievementFilterOptions } from '@app/domain/entities';

export interface AchievementRepository {
  getAchievements(
    filterOptions?: AchievementFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>>;

  getAchievement(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>>;

  createAchievement(
    achievement: Omit<
      Achievement,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competition'
      | 'competitionTeamType'
      | 'competitionScale'
      | 'competitionTimeRange'
      | 'competitionOutput'
      | 'competitionRank'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
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
        | 'competitionTeamType'
        | 'competitionScale'
        | 'competitionTimeRange'
        | 'competitionOutput'
        | 'competitionRank'
      >
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>>;

  deleteAchievement(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>>;
}
