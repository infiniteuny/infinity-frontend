import type { CompetitionOrganizerTypeRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionOrganizerType,
  CompetitionOrganizerTypeFilterOptions,
  CompetitionOrganizerTypeSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionOrganizerTypesParams = [
  filterOptions?: CompetitionOrganizerTypeFilterOptions,
  sortOptions?: CompetitionOrganizerTypeSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionOrganizerTypes implements UseCase<
  Promise<Either<[CompetitionOrganizerType[], PaginationOptions], Error>>,
  GetCompetitionOrganizerTypesParams
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
    filterOptions?: CompetitionOrganizerTypeFilterOptions,
    sortOptions?: CompetitionOrganizerTypeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionOrganizerType[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionOrganizerTypeRepository.getCompetitionOrganizerTypes(
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
