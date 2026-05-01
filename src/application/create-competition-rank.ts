import type { CompetitionRankRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionRank } from '@app/domain/entities';

export type CreateCompetitionRankParams = [
  competitionRank: Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCompetitionRank implements UseCase<
  Promise<Either<CompetitionRank, Error>>,
  CreateCompetitionRankParams
> {
  private readonly competitionRankRepository: CompetitionRankRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRankRepository)
    competitionRankRepository: CompetitionRankRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionRankRepository = competitionRankRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    competitionRank: Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionRank, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionRankRepository.createCompetitionRank(
        competitionRank,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
