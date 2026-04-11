import type { CompetitionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  Competition,
  CompetitionFilterOptions,
  CompetitionIncludeOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionsParams = [
  includeOptions?: CompetitionIncludeOptions,
  filterOptions?: CompetitionFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCompetitions implements UseCase<
  Promise<Either<[Competition[], PaginationOptions], Error>>,
  GetCompetitionsParams
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

  public async execute(
    includeOptions?: CompetitionIncludeOptions,
    filterOptions?: CompetitionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Competition[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.competitionRepository.getCompetitions(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
