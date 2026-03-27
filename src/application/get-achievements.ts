import type { AchievementRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Achievement,
  AchievementFilterOptions,
  AchievementIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetAchievementsParams = [
  includeOptions?: AchievementIncludeOptions,
  filterOptions?: AchievementFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetAchievements implements UseCase<
  Promise<Either<[Achievement[], PaginationOptions], Error>>,
  GetAchievementsParams
> {
  private readonly achievementRepository: AchievementRepository;

  public constructor(
    @inject(SYMBOLS.AchievementRepository)
    achievementRepository: AchievementRepository,
  ) {
    this.achievementRepository = achievementRepository;
  }

  public async execute(
    includeOptions?: AchievementIncludeOptions,
    filterOptions?: AchievementFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>> {
    return await this.achievementRepository.getAchievements(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
