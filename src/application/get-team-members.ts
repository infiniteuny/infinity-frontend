import type { TeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  PaginationOptions,
  TeamMember,
  TeamMemberFilterOptions,
  TeamMemberIncludeOptions,
} from '@app/domain/entities';

export type GetTeamMembersParams = [
  teamId: string,
  includeOptions?: TeamMemberIncludeOptions,
  filterOptions?: TeamMemberFilterOptions,
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
        paginationOptions,
        abortSignal,
        accessToken,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
