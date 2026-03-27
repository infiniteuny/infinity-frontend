import type { FundApplicationRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { FundApplication } from '@app/domain/entities';

export type CreateFundApplicationParams = [
  fundApplication: Omit<
    FundApplication,
    'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
  >,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateFundApplication implements UseCase<
  Promise<Either<FundApplication, Error>>,
  CreateFundApplicationParams
> {
  private readonly fundApplicationRepository: FundApplicationRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
  }

  public async execute(
    fundApplication: Omit<
      FundApplication,
      'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>> {
    return await this.fundApplicationRepository.createFundApplication(
      fundApplication,
      abortSignal,
      authenticate,
    );
  }
}
