import type {
  CompetitionOrganizerTypeRepository,
  AuthRepository,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CompetitionOrganizerType } from '@infiniteuny/infinity-domain';

export type DeleteCompetitionOrganizerTypeParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCompetitionOrganizerType implements UseCase<
  Promise<Either<CompetitionOrganizerType, Error>>,
  DeleteCompetitionOrganizerTypeParams
> {
  private readonly competitionOrganizerTypeRepository: CompetitionOrganizerTypeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionOrganizerTypeRepository)
    competitionOrganizerTypeRepository: CompetitionOrganizerTypeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionOrganizerTypeRepository = competitionOrganizerTypeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOrganizerTypeRepository.deleteCompetitionOrganizerType(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
