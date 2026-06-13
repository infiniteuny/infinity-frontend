import type { AchievementRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Achievement,
  AchievementFilterOptions,
  AchievementIncludeOptions,
  AchievementSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetAchievementsParams = [
  includeOptions?: AchievementIncludeOptions,
  filterOptions?: AchievementFilterOptions,
  sortOptions?: AchievementSortOptions,
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
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AchievementRepository)
    achievementRepository: AchievementRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.achievementRepository = achievementRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: AchievementIncludeOptions,
    filterOptions?: AchievementFilterOptions,
    sortOptions?: AchievementSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.achievementRepository.getAchievements(
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
