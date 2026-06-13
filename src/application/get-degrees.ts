import type { DegreeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Degree,
  DegreeFilterOptions,
  DegreeSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetDegreesParams = [
  filterOptions?: DegreeFilterOptions,
  sortOptions?: DegreeSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetDegrees implements UseCase<
  Promise<Either<[Degree[], PaginationOptions], Error>>,
  GetDegreesParams
> {
  private readonly degreeRepository: DegreeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.DegreeRepository)
    degreeRepository: DegreeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.degreeRepository = degreeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: DegreeFilterOptions,
    sortOptions?: DegreeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[Degree[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.degreeRepository.getDegrees(
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
