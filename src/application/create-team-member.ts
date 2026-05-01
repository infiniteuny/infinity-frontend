import type { TeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { TeamMember } from '@app/domain/entities';

export type CreateTeamMemberParams = [
  teamId: string,
  teamMember: { userId: string; role: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateTeamMember implements UseCase<
  Promise<Either<TeamMember, Error>>,
  CreateTeamMemberParams
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
    teamMember: { userId: string; role: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<TeamMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.teamMemberRepository.createTeamMember(
        teamId,
        teamMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
