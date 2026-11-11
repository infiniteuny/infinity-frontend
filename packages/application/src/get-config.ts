import type { ConfigRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Config } from '@infiniteuny/infinity-domain';

export type GetConfigParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class GetConfig implements UseCase<Promise<Either<Config, Error>>, GetConfigParams> {
  private readonly configRepository: ConfigRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.ConfigRepository)
    configRepository: ConfigRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.configRepository = configRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Config, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.configRepository.getConfig(id, abortSignal, accessToken);
  }
}
