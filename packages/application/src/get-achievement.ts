import type { AchievementRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Achievement, AchievementIncludeOptions } from '@infiniteuny/infinity-domain';

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
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AchievementRepository)
    achievementRepository: AchievementRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.achievementRepository = achievementRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    includeOptions?: AchievementIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Achievement, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.achievementRepository.getAchievement(
      id,
      includeOptions,
      abortSignal,
      accessToken,
    );
  }
}
