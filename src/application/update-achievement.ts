import type { AchievementRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Achievement } from '@app/domain/entities';

export type UpdateAchievementParams = [
  id: string,
  achievement: Partial<
    Omit<
      Achievement,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competitionInstance'
      | 'competitionScale'
      | 'competitionTimeRange'
      | 'competitionOutput'
      | 'competitionRank'
    >
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateAchievement implements UseCase<
  Promise<Either<Achievement, Error>>,
  UpdateAchievementParams
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
  ): Promise<Either<Achievement, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.achievementRepository.updateAchievement(
        id,
        achievement,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
