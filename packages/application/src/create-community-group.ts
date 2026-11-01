import type { CommunityGroupRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CommunityGroup } from '@infiniteuny/infinity-domain';

export type CreateCommunityGroupParams = [
  communityGroup: Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCommunityGroup implements UseCase<
  Promise<Either<CommunityGroup, Error>>,
  CreateCommunityGroupParams
> {
  private readonly communityGroupRepository: CommunityGroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupRepository)
    communityGroupRepository: CommunityGroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupRepository = communityGroupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    communityGroup: Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroup, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupRepository.createCommunityGroup(
        communityGroup,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
