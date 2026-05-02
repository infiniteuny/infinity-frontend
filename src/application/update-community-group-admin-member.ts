import type { CommunityGroupAdminMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdminMember } from '@app/domain/entities';

export type UpdateCommunityGroupAdminMemberParams = [
  id: string,
  communityGroupAdminMember: {
    userId?: string;
    communityGroupId?: string;
    photo?: File;
    animation?: File;
  },
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCommunityGroupAdminMember implements UseCase<
  Promise<Either<CommunityGroupAdminMember, Error>>,
  UpdateCommunityGroupAdminMemberParams
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
    communityGroupAdminMember: {
      userId?: string;
      communityGroupId?: string;
      photo?: File;
      animation?: File;
    },
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupAdminMemberRepository.updateCommunityGroupAdminMember(
        id,
        communityGroupAdminMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
