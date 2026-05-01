import type { TeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { TeamMember, TeamMemberIncludeOptions } from '@app/domain/entities';

export type GetTeamMemberParams = [
  id: string,
  includeOptions?: TeamMemberIncludeOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetTeamMember implements UseCase<
  Promise<Either<TeamMember, Error>>,
  GetTeamMemberParams
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
    id: string,
    includeOptions?: TeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<TeamMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.teamMemberRepository.getTeamMember(
        id,
        includeOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
