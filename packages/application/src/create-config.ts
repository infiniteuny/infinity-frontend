import type { ConfigRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Config } from '@infiniteuny/infinity-domain';

export type CreateConfigParams = [
  config: Omit<Config, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateConfig implements UseCase<Promise<Either<Config, Error>>, CreateConfigParams> {
  private readonly configRepository: ConfigRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.ConfigRepository)
    configRepository: ConfigRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.configRepository = configRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    config: Omit<Config, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Config, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.configRepository.createConfig(config, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
