import type { TeamMemberRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import {
  PaginationOptions,
  TeamMember,
  TeamMemberFilterOptions,
  TeamMemberIncludeOptions,
  TeamMemberSortOptions,
} from '@infiniteuny/infinity-domain';

export type GetTeamMembersParams = [
  teamId: string,
  includeOptions?: TeamMemberIncludeOptions,
  filterOptions?: TeamMemberFilterOptions,
  sortOptions?: TeamMemberSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetTeamMembers implements UseCase<
  Promise<Either<[TeamMember[], PaginationOptions], Error>>,
  GetTeamMembersParams
> {
  private readonly teamMemberRepository: TeamMemberRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.TeamMemberRepository)
    teamMemberRepository: TeamMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.teamMemberRepository = teamMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    teamId: string,
    includeOptions?: TeamMemberIncludeOptions,
    filterOptions?: TeamMemberFilterOptions,
    sortOptions?: TeamMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[TeamMember[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      const accessToken = accessTokenResult.right;

      return await this.teamMemberRepository.getTeamMembers(
        teamId,
        includeOptions,
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessToken,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
