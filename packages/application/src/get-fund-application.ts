import type { FundApplicationRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { FundApplication, FundApplicationIncludeOptions } from '@infiniteuny/infinity-domain';

export type GetFundApplicationParams = [
  id: string,
  includeOptions?: FundApplicationIncludeOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetFundApplication implements UseCase<
  Promise<Either<FundApplication, Error>>,
  GetFundApplicationParams
> {
  private readonly fundApplicationRepository: FundApplicationRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    includeOptions?: FundApplicationIncludeOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<FundApplication, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.fundApplicationRepository.getFundApplication(
        id,
        includeOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
