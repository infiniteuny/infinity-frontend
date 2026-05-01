import type { FundApplicationRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { FundApplication } from '@app/domain/entities';

export type UpdateFundApplicationParams = [
  id: string,
  fundApplication: Partial<
    Omit<
      FundApplication,
      'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
    >
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateFundApplication implements UseCase<
  Promise<Either<FundApplication, Error>>,
  UpdateFundApplicationParams
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
    fundApplication: Partial<
      Omit<
        FundApplication,
        'id' | 'createdAt' | 'updatedAt' | 'team' | 'competitionInstance' | 'competitionScale'
      >
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<FundApplication, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.fundApplicationRepository.updateFundApplication(
        id,
        fundApplication,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
