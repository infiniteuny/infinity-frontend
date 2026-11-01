import type { CommunityGroupAdminRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CommunityGroupAdmin } from '@infiniteuny/infinity-domain';

export type UpdateCommunityGroupAdminParams = [
  id: string,
  communityGroupAdmin: Partial<
    Omit<CommunityGroupAdmin, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCommunityGroupAdmin implements UseCase<
  Promise<Either<CommunityGroupAdmin, Error>>,
  UpdateCommunityGroupAdminParams
> {
  private readonly communityGroupAdminRepository: CommunityGroupAdminRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    communityGroupAdmin: Partial<
      Omit<CommunityGroupAdmin, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupAdminRepository.updateCommunityGroupAdmin(
        id,
        communityGroupAdmin,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
