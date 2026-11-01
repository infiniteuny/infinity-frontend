import type { ConfigRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Config } from '@infiniteuny/infinity-domain';

export type UpdateConfigParams = [
  id: string,
  config: Partial<Omit<Config, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateConfig implements UseCase<Promise<Either<Config, Error>>, UpdateConfigParams> {
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
    id: string,
    config: Partial<Omit<Config, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Config, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.configRepository.updateConfig(
        id,
        config,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
