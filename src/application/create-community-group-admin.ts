import type { CommunityGroupAdminRepository, AuthRepository } from '@app/domain/repositories';
import { Either, isRight, left } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdmin } from '@app/domain/entities';

export type CreateCommunityGroupAdminParams = [
  communityGroupAdmin: Omit<
    CommunityGroupAdmin,
    'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCommunityGroupAdmin implements UseCase<
  Promise<Either<CommunityGroupAdmin, Error>>,
  CreateCommunityGroupAdminParams
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
    communityGroupAdmin: Omit<
      CommunityGroupAdmin,
      'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.communityGroupAdminRepository.createCommunityGroupAdmin(
        communityGroupAdmin,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
