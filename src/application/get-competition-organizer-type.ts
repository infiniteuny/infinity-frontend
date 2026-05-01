import type { CompetitionOrganizerTypeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionOrganizerType } from '@app/domain/entities';

export type GetCompetitionOrganizerTypeParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class GetCompetitionOrganizerType implements UseCase<
  Promise<Either<CompetitionOrganizerType, Error>>,
  GetCompetitionOrganizerTypeParams
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
      return await this.competitionOrganizerTypeRepository.getCompetitionOrganizerType(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
