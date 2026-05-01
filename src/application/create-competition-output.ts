import type { CompetitionOutputRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionOutput } from '@app/domain/entities';

export type CreateCompetitionOutputParams = [
  competitionOutput: Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCompetitionOutput implements UseCase<
  Promise<Either<CompetitionOutput, Error>>,
  CreateCompetitionOutputParams
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
    competitionOutput: Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionOutput, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOutputRepository.createCompetitionOutput(
        competitionOutput,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
