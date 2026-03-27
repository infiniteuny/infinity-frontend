import type { AchievementRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Achievement, AchievementIncludeOptions } from '@app/domain/entities';

export type GetAchievementParams = [
  id: string,
  includeOptions?: AchievementIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetAchievement implements UseCase<
  Promise<Either<Achievement, Error>>,
  GetAchievementParams
> {
  private readonly achievementRepository: AchievementRepository;

  public constructor(
    @inject(SYMBOLS.AchievementRepository)
    achievementRepository: AchievementRepository,
  ) {
    this.achievementRepository = achievementRepository;
  }

  public async execute(
    id: string,
    includeOptions?: AchievementIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>> {
    return await this.achievementRepository.getAchievement(
      id,
      includeOptions,
      abortSignal,
      authenticate,
    );
  }
}
