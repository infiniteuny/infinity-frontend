import type { CompetitionTimeRangeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionTimeRange } from '@app/domain/entities';

export type UpdateCompetitionTimeRangeParams = [
  id: string,
  competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCompetitionTimeRange implements UseCase<
  Promise<Either<CompetitionTimeRange, Error>>,
  UpdateCompetitionTimeRangeParams
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
    id: string,
    competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionTimeRange, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionTimeRangeRepository.updateCompetitionTimeRange(
        id,
        competitionTimeRange,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
