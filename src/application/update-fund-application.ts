import type { FundApplicationRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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
  authenticate?: boolean,
];

@injectable()
export class UpdateFundApplication implements UseCase<
  Promise<Either<FundApplication, Error>>,
  UpdateFundApplicationParams
> {
  private readonly fundApplicationRepository: FundApplicationRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
  }

  public async execute(
    id: string,
    fundApplication: Partial<
      Omit<
        FundApplication,
        'id' | 'createdAt' | 'updatedAt' | 'team' | 'competition' | 'competitionScale'
      >
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>> {
    return await this.fundApplicationRepository.updateFundApplication(
      id,
      fundApplication,
      abortSignal,
      authenticate,
    );
  }
}
