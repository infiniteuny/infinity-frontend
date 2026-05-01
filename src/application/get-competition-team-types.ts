import type { CompetitionTeamTypeRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionTeamTypesParams = [
  filterOptions?: CompetitionTeamTypeFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionTeamTypes implements UseCase<
  Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>>,
  GetCompetitionTeamTypesParams
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
    filterOptions?: CompetitionTeamTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionTeamTypeRepository.getCompetitionTeamTypes(
        filterOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
