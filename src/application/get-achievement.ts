import type { AchievementRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
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
    includeOptions?: AchievementIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Achievement, Error>> {
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

    return await this.achievementRepository.getAchievement(
      id,
      includeOptions,
      abortSignal,
      accessToken,
    );
  }
}
