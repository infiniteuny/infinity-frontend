import type { TeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Team } from '@app/domain/entities';

export type UpdateTeamParams = [
  id: string,
  team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateTeam implements UseCase<Promise<Either<Team, Error>>, UpdateTeamParams> {
  private readonly teamRepository: TeamRepository;

  public constructor(
    @inject(SYMBOLS.TeamRepository)
    teamRepository: TeamRepository,
  ) {
    this.teamRepository = teamRepository;
  }

  public async execute(
    id: string,
    team: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leader' | 'teamType'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>> {
    return await this.teamRepository.updateTeam(id, team, abortSignal, authenticate);
  }
}
