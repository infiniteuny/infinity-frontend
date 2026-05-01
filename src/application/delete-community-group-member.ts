import type { CommunityGroupMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupMember } from '@app/domain/entities';

export type DeleteCommunityGroupMemberParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCommunityGroupMember implements UseCase<
  Promise<Either<CommunityGroupMember, Error>>,
  DeleteCommunityGroupMemberParams
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
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupMember, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupMemberRepository.deleteCommunityGroupMember(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
