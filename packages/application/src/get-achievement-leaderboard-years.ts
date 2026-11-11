import type {
  AchievementLeaderboardRepository,
  AuthRepository,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { PaginationOptions, SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetAchievementLeaderboardYearsParams = [
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetAchievementLeaderboardYears implements UseCase<
  Promise<Either<[number[], PaginationOptions], Error>>,
  GetAchievementLeaderboardYearsParams
> {
  private readonly achievementLeaderboardRepository: AchievementLeaderboardRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AchievementLeaderboardRepository)
    achievementLeaderboardRepository: AchievementLeaderboardRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.achievementLeaderboardRepository = achievementLeaderboardRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[number[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.achievementLeaderboardRepository.getAchievementLeaderboardYears(
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
