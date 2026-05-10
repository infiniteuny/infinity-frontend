import type { CompetitionOutputRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionOutput } from '@app/domain/entities';

export type DeleteCompetitionOutputParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCompetitionOutput implements UseCase<
  Promise<Either<CompetitionOutput, Error>>,
  DeleteCompetitionOutputParams
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
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionOutput, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOutputRepository.deleteCompetitionOutput(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
