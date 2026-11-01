import type { CoreTeamRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  CoreTeam,
  CoreTeamFilterOptions,
  CoreTeamSortOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetCoreTeamsParams = [
  filterOptions?: CoreTeamFilterOptions,
  sortOptions?: CoreTeamSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCoreTeams implements UseCase<
  Promise<Either<[CoreTeam[], PaginationOptions], Error>>,
  GetCoreTeamsParams
> {
  private readonly coreTeamRepository: CoreTeamRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CoreTeamFilterOptions,
    sortOptions?: CoreTeamSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CoreTeam[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.coreTeamRepository.getCoreTeams(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
