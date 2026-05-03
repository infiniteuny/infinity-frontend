import type { CoreTeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeamMember } from '@app/domain/entities';

export type UpdateCoreTeamMemberParams = [
  id: string,
  coreTeamMember: {
    userId?: string;
    coreTeamDivisionId?: string;
    photo?: File;
    animation?: File | null;
  },
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCoreTeamMember implements UseCase<
  Promise<Either<CoreTeamMember, Error>>,
  UpdateCoreTeamMemberParams
> {
  private readonly coreTeamMemberRepository: CoreTeamMemberRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamMemberRepository)
    coreTeamMemberRepository: CoreTeamMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamMemberRepository = coreTeamMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    coreTeamMember: {
      userId?: string;
      coreTeamDivisionId?: string;
      photo?: File;
      animation?: File | null;
    },
    abortSignal?: AbortSignal,
  ): Promise<Either<CoreTeamMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamMemberRepository.updateCoreTeamMember(
        id,
        coreTeamMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
