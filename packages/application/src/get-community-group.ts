import type { CommunityGroupRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CommunityGroup } from '@infiniteuny/infinity-domain';

export type GetCommunityGroupParams = [
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroup implements UseCase<
  Promise<Either<CommunityGroup, Error>>,
  GetCommunityGroupParams
> {
  private readonly communityGroupRepository: CommunityGroupRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupRepository)
    communityGroupRepository: CommunityGroupRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.communityGroupRepository = communityGroupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CommunityGroup, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupRepository.getCommunityGroup(id, abortSignal, accessToken);
  }
}
