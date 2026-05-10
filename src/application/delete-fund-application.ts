import type { FundApplicationRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { FundApplication } from '@app/domain/entities';

export type DeleteFundApplicationParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteFundApplication implements UseCase<
  Promise<Either<FundApplication, Error>>,
  DeleteFundApplicationParams
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
    abortSignal?: AbortSignal,
  ): Promise<Either<FundApplication, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.fundApplicationRepository.deleteFundApplication(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
