import type { CompetitionScaleRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionScale } from '@app/domain/entities';

export type CreateCompetitionScaleParams = [
  competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCompetitionScale implements UseCase<
  Promise<Either<CompetitionScale, Error>>,
  CreateCompetitionScaleParams
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
    competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionScale, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionScaleRepository.createCompetitionScale(
        competitionScale,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
