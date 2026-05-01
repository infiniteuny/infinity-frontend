import type { CompetitionOrganizerTypeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CompetitionOrganizerType } from '@app/domain/entities';

export type UpdateCompetitionOrganizerTypeParams = [
  id: string,
  competitionOrganizerType: Partial<
    Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>
  >,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCompetitionOrganizerType implements UseCase<
  Promise<Either<CompetitionOrganizerType, Error>>,
  UpdateCompetitionOrganizerTypeParams
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
    competitionOrganizerType: Partial<
      Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>
    >,
    abortSignal?: AbortSignal,
  ): Promise<Either<CompetitionOrganizerType, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOrganizerTypeRepository.updateCompetitionOrganizerType(
        id,
        competitionOrganizerType,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
