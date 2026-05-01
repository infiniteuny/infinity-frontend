import type { CompetitionOutputRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionOutput } from '@app/domain/entities';

export type UpdateCompetitionOutputParams = [
  id: string,
  competitionOutput: Partial<Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCompetitionOutput implements UseCase<
  Promise<Either<CompetitionOutput, Error>>,
  UpdateCompetitionOutputParams
> {
  private readonly competitionOutputRepository: CompetitionOutputRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionOutputRepository)
    competitionOutputRepository: CompetitionOutputRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionOutputRepository = competitionOutputRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    competitionOutput: Partial<Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionOutput, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOutputRepository.updateCompetitionOutput(
        id,
        competitionOutput,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
