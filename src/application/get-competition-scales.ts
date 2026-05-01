import type { CompetitionScaleRepository, AuthRepository } from '@app/domain/repositories';
import {
  CompetitionScale,
  CompetitionScaleFilterOptions,
  PaginationOptions,
} from '@app/domain/entities';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCompetitionScalesParams = [
  filterOptions?: CompetitionScaleFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCompetitionScales implements UseCase<
  Promise<Either<[CompetitionScale[], PaginationOptions], Error>>,
  GetCompetitionScalesParams
> {
  private readonly competitionScaleRepository: CompetitionScaleRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CompetitionScaleRepository)
    competitionScaleRepository: CompetitionScaleRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.competitionScaleRepository = competitionScaleRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CompetitionScaleFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.competitionScaleRepository.getCompetitionScales(
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
