import type { ConfigRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { PaginationOptions, Config, ConfigFilterOptions } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetConfigsParams = [
  filterOptions?: ConfigFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetConfigs implements UseCase<
  Promise<Either<[Config[], PaginationOptions], Error>>,
  GetConfigsParams
> {
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
    filterOptions?: ConfigFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Config[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.configRepository.getConfigs(
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
