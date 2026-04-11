import type { TeamRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Team } from '@app/domain/entities';

export type CreateTeamParams = [
  team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateTeam implements UseCase<Promise<Either<Team, Error>>, CreateTeamParams> {
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
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>,
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

    return await this.teamRepository.createTeam(team, abortSignal, accessToken);
  }
}
