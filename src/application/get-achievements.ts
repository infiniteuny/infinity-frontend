import type { AchievementRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
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
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Achievement[], PaginationOptions], Error>> {
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

    return await this.achievementRepository.getAchievements(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
