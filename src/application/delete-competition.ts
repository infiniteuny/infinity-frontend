import type { CompetitionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { Competition } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type DeleteCompetitionParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCompetition implements UseCase<
  Promise<Either<Competition, Error>>,
  DeleteCompetitionParams
> {
  private readonly competitionRepository: CompetitionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionRepository)
    competitionRepository: CompetitionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionRepository = competitionRepository;
    this.authRepository = authRepository;
  }

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<Competition, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionRepository.deleteCompetition(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
