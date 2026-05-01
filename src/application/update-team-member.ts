import type { TeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { TeamMember } from '@app/domain/entities';

export type UpdateTeamMemberParams = [
  id: string,
  teamMember: { role?: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateTeamMember implements UseCase<
  Promise<Either<TeamMember, Error>>,
  UpdateTeamMemberParams
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
    teamMember: { role?: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<TeamMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.teamMemberRepository.updateTeamMember(
        id,
        teamMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
