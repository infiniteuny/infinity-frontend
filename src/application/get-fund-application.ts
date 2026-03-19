import type { FundApplicationRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { FundApplication, FundApplicationIncludeOptions } from '@app/domain/entities';

export type GetFundApplicationParams = [
  id: string,
  includeOptions?: FundApplicationIncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetFundApplication
  implements UseCase<Promise<Either<FundApplication, Error>>, GetFundApplicationParams>
{
  private readonly fundApplicationRepository: FundApplicationRepository;

  public constructor(
    @inject(SYMBOLS.FundApplicationRepository)
    fundApplicationRepository: FundApplicationRepository,
  ) {
    this.fundApplicationRepository = fundApplicationRepository;
  }

  public async execute(
    id: string,
    includeOptions?: FundApplicationIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>> {
    return await this.fundApplicationRepository.getFundApplication(
      id,
      includeOptions,
      abortSignal,
      authenticate,
    );
  }
}
