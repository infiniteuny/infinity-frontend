import type { CompetitionScaleRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionScale } from '@app/domain/entities';

export type GetCompetitionScaleParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class GetCompetitionScale implements UseCase<
  Promise<Either<CompetitionScale, Error>>,
  GetCompetitionScaleParams
> {
  private readonly competitionScaleRepository: CompetitionScaleRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionScaleRepository)
    competitionScaleRepository: CompetitionScaleRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionScaleRepository = competitionScaleRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionScale, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionScaleRepository.getCompetitionScale(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
