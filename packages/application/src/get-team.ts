import type { TeamRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { Team, TeamIncludeOptions } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetTeamParams = [
  id: string,
  includeOptions?: TeamIncludeOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetTeam implements UseCase<Promise<Either<Team, Error>>, GetTeamParams> {
  private readonly teamRepository: TeamRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.TeamRepository)
    teamRepository: TeamRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.teamRepository = teamRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    includeOptions?: TeamIncludeOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<Team, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.teamRepository.getTeam(
        id,
        includeOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
