import type { TeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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

  public constructor(
    @inject(SYMBOLS.TeamRepository)
    teamRepository: TeamRepository,
  ) {
    this.teamRepository = teamRepository;
  }

  public async execute(
    id: string,
    includeOptions?: TeamIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Team, Error>> {
    return await this.teamRepository.getTeam(id, includeOptions, abortSignal, authenticate);
  }
}
