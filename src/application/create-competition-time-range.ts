import type { CompetitionTimeRangeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionTimeRange } from '@app/domain/entities';

export type CreateCompetitionTimeRangeParams = [
  competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCompetitionTimeRange implements UseCase<
  Promise<Either<CompetitionTimeRange, Error>>,
  CreateCompetitionTimeRangeParams
> {
  private readonly competitionTimeRangeRepository: CompetitionTimeRangeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTimeRangeRepository)
    competitionTimeRangeRepository: CompetitionTimeRangeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionTimeRangeRepository = competitionTimeRangeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionTimeRangeRepository.createCompetitionTimeRange(
        competitionTimeRange,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
