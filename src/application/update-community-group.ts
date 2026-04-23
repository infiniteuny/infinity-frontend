import type { CommunityGroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroup } from '@app/domain/entities';

export type UpdateCommunityGroupParams = [
  id: string,
  communityGroup: Partial<Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateCommunityGroup implements UseCase<
  Promise<Either<CommunityGroup, Error>>,
  UpdateCommunityGroupParams
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
    id: string,
    communityGroup: Partial<Omit<CommunityGroup, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupRepository.updateCommunityGroup(
      id,
      communityGroup,
      abortSignal,
      accessToken,
    );
  }
}
