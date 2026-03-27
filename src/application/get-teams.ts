import type { TeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Team,
  TeamFilterOptions,
  TeamIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetTeamsParams = [
  includeOptions?: TeamIncludeOptions,
  filterOptions?: TeamFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetTeams implements UseCase<
  Promise<Either<[Team[], PaginationOptions], Error>>,
  GetTeamsParams
> {
  private readonly teamRepository: TeamRepository;

  public constructor(
    @inject(SYMBOLS.TeamRepository)
    teamRepository: TeamRepository,
  ) {
    this.teamRepository = teamRepository;
  }

  public async execute(
    includeOptions?: TeamIncludeOptions,
    filterOptions?: TeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Team[], PaginationOptions], Error>> {
    return await this.teamRepository.getTeams(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
