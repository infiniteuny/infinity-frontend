import type { MajorRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Major,
  MajorFilterOptions,
  MajorIncludeOptions,
  MajorSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetMajorsParams = [
  includeOptions?: MajorIncludeOptions,
  filterOptions?: MajorFilterOptions,
  sortOptions?: MajorSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetMajors implements UseCase<
  Promise<Either<[Major[], PaginationOptions], Error>>,
  GetMajorsParams
> {
  private readonly majorRepository: MajorRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.MajorRepository)
    majorRepository: MajorRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.majorRepository = majorRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    includeOptions?: MajorIncludeOptions,
    filterOptions?: MajorFilterOptions,
    sortOptions?: MajorSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[Major[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.majorRepository.getMajors(
        includeOptions,
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
