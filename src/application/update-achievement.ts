import type { AchievementRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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
      | 'competition'
      | 'competitionScale'
      | 'competitionTimeRange'
      | 'competitionOutput'
      | 'competitionRank'
    >
  >,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateAchievement
  implements UseCase<Promise<Either<Achievement, Error>>, UpdateAchievementParams>
{
  private readonly achievementRepository: AchievementRepository;

  public constructor(
    @inject(SYMBOLS.AchievementRepository)
    achievementRepository: AchievementRepository,
  ) {
    this.achievementRepository = achievementRepository;
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
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>> {
    return await this.achievementRepository.updateAchievement(
      id,
      achievement,
      abortSignal,
      authenticate,
    );
  }
}
