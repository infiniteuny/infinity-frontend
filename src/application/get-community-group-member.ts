import type { CommunityGroupMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupMember, CommunityGroupMemberIncludeOptions } from '@app/domain/entities';

export type GetCommunityGroupMemberParams = [
  id: string,
  includeOptions?: CommunityGroupMemberIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroupMember implements UseCase<
  Promise<Either<CommunityGroupMember, Error>>,
  GetCommunityGroupMemberParams
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
    includeOptions?: CommunityGroupMemberIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroupMember, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupMemberRepository.getCommunityGroupMember(
      id,
      includeOptions,
      abortSignal,
      accessToken,
    );
  }
}
