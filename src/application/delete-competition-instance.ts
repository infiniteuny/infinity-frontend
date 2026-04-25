import type { CompetitionInstanceRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { CompetitionInstance } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type DeleteCompetitionInstanceParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCompetitionInstance implements UseCase<
  Promise<Either<CompetitionInstance, Error>>,
  DeleteCompetitionInstanceParams
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
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionInstance, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionInstanceRepository.deleteCompetitionInstance(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
