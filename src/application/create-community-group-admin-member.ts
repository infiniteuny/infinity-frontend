import type { CommunityGroupAdminMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdminMember } from '@app/domain/entities';

export type CreateCommunityGroupAdminMemberParams = [
  communityGroupAdminId: string,
  communityGroupAdminMember: {
    userId: string;
    communityGroupId: string;
    photo: File;
    animation: File | null;
  },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCommunityGroupAdminMember implements UseCase<
  Promise<Either<CommunityGroupAdminMember, Error>>,
  CreateCommunityGroupAdminMemberParams
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
    communityGroupAdminId: string,
    communityGroupAdminMember: {
      userId: string;
      communityGroupId: string;
      photo: File;
      animation: File | null;
    },
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupAdminMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupAdminMemberRepository.createCommunityGroupAdminMember(
        communityGroupAdminId,
        communityGroupAdminMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
