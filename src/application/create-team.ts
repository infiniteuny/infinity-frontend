import type { TeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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

  public constructor(
    @inject(SYMBOLS.TeamRepository)
    teamRepository: TeamRepository,
  ) {
    this.teamRepository = teamRepository;
  }

  public async execute(
    team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>> {
    return await this.teamRepository.createTeam(team, abortSignal, authenticate);
  }
}
