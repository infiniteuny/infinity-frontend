import type { CoreTeamDivisionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  CoreTeamDivision,
  CoreTeamDivisionFilterOptions,
  CoreTeamDivisionSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCoreTeamDivisionsParams = [
  filterOptions?: CoreTeamDivisionFilterOptions,
  sortOptions?: CoreTeamDivisionSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetCoreTeamDivisions implements UseCase<
  Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>>,
  GetCoreTeamDivisionsParams
> {
  private readonly coreTeamDivisionRepository: CoreTeamDivisionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamDivisionRepository)
    coreTeamDivisionRepository: CoreTeamDivisionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamDivisionRepository = coreTeamDivisionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CoreTeamDivisionFilterOptions,
    sortOptions?: CoreTeamDivisionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[CoreTeamDivision[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamDivisionRepository.getCoreTeamDivisions(
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
