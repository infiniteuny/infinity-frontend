import type { CompetitionInstanceRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { CompetitionInstance } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type CreateCompetitionInstanceParams = [
  competitionInstance: Omit<
    CompetitionInstance,
    'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCompetitionInstance implements UseCase<
  Promise<Either<CompetitionInstance, Error>>,
  CreateCompetitionInstanceParams
> {
  private readonly competitionInstanceRepository: CompetitionInstanceRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionInstanceRepository)
    competitionInstanceRepository: CompetitionInstanceRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionInstanceRepository = competitionInstanceRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    competitionInstance: Omit<
      CompetitionInstance,
      'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionInstance, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionInstanceRepository.createCompetitionInstance(
        competitionInstance,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
