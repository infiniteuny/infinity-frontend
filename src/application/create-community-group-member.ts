import type { CommunityGroupMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupMember } from '@app/domain/entities';

export type CreateCommunityGroupMemberParams = [
  communityGroupId: string,
  communityGroupMember: { userId: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCommunityGroupMember implements UseCase<
  Promise<Either<CommunityGroupMember, Error>>,
  CreateCommunityGroupMemberParams
> {
  private readonly communityGroupMemberRepository: CommunityGroupMemberRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupMemberRepository)
    communityGroupMemberRepository: CommunityGroupMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupMemberRepository = communityGroupMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    communityGroupId: string,
    communityGroupMember: { userId: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupMemberRepository.createCommunityGroupMember(
        communityGroupId,
        communityGroupMember,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
