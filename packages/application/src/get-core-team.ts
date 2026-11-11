import type { CoreTeamRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CoreTeam } from '@infiniteuny/infinity-domain';

export type GetCoreTeamParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class GetCoreTeam implements UseCase<Promise<Either<CoreTeam, Error>>, GetCoreTeamParams> {
  private readonly coreTeamRepository: CoreTeamRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.coreTeamRepository.getCoreTeam(id, abortSignal, accessToken);
  }
}
