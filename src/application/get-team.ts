import type { TeamRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { Team, TeamIncludeOptions } from '@app/domain/entities';
import { UseCase } from '@app/application';

export type GetTeamParams = [
  id: string,
  includeOptions?: TeamIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
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
    authenticate?: boolean,
  ): Promise<Either<Team, Error>> {
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

    return await this.teamRepository.getTeam(id, includeOptions, abortSignal, accessToken);
  }
}
