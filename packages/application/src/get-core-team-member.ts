import type { CoreTeamMemberRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CoreTeamMember, CoreTeamMemberIncludeOptions } from '@infiniteuny/infinity-domain';

export type GetCoreTeamMemberParams = [
  id: string,
  includeOptions?: CoreTeamMemberIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCoreTeamMember implements UseCase<
  Promise<Either<CoreTeamMember, Error>>,
  GetCoreTeamMemberParams
> {
  private readonly coreTeamMemberRepository: CoreTeamMemberRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamMemberRepository)
    coreTeamMemberRepository: CoreTeamMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.coreTeamMemberRepository = coreTeamMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeamMember, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.coreTeamMemberRepository.getCoreTeamMember(
      id,
      includeOptions,
      abortSignal,
      accessToken,
    );
  }
}
