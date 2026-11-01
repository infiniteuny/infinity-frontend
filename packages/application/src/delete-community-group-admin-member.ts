import type {
  CommunityGroupAdminMemberRepository,
  AuthRepository,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CommunityGroupAdminMember } from '@infiniteuny/infinity-domain';

export type DeleteCommunityGroupAdminMemberParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCommunityGroupAdminMember implements UseCase<
  Promise<Either<CommunityGroupAdminMember, Error>>,
  DeleteCommunityGroupAdminMemberParams
> {
  private readonly communityGroupAdminMemberRepository: CommunityGroupAdminMemberRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminMemberRepository)
    communityGroupAdminMemberRepository: CommunityGroupAdminMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupAdminMemberRepository = communityGroupAdminMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupAdminMemberRepository.deleteCommunityGroupAdminMember(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
