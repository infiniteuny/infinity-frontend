import type { CoreTeamMemberRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CoreTeamMember } from '@infiniteuny/infinity-domain';

export type DeleteCoreTeamMemberParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCoreTeamMember implements UseCase<
  Promise<Either<CoreTeamMember, Error>>,
  DeleteCoreTeamMemberParams
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
    abortSignal?: AbortSignal,
  ): Promise<Either<CoreTeamMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamMemberRepository.deleteCoreTeamMember(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
