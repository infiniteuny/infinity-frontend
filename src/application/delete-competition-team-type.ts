import type { CompetitionTeamTypeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionTeamType } from '@app/domain/entities';

export type DeleteCompetitionTeamTypeParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCompetitionTeamType implements UseCase<
  Promise<Either<CompetitionTeamType, Error>>,
  DeleteCompetitionTeamTypeParams
> {
  private readonly competitionTeamTypeRepository: CompetitionTeamTypeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionTeamTypeRepository)
    competitionTeamTypeRepository: CompetitionTeamTypeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionTeamTypeRepository = competitionTeamTypeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionTeamType, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionTeamTypeRepository.deleteCompetitionTeamType(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
