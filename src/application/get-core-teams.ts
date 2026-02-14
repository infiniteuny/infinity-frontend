import type { CoreTeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, CoreTeam, CoreTeamFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCoreTeamsParams = [
  filterOptions?: CoreTeamFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCoreTeams
  implements UseCase<Promise<Either<[CoreTeam[], PaginationOptions], Error>>, GetCoreTeamsParams>
{
  private readonly coreTeamRepository: CoreTeamRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
  }

  public async execute(
    filterOptions?: CoreTeamFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>> {
    return await this.coreTeamRepository.getCoreTeams(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
