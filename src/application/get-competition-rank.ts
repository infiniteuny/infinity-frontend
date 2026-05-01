import type { CompetitionRankRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionRank } from '@app/domain/entities';

export type GetCompetitionRankParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class GetCompetitionRank implements UseCase<
  Promise<Either<CompetitionRank, Error>>,
  GetCompetitionRankParams
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
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionRank, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionRankRepository.getCompetitionRank(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
