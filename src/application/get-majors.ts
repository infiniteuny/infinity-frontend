import type { MajorRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Major,
  MajorFilterOptions,
  MajorIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetMajorsParams = [
  includeOptions?: MajorIncludeOptions,
  filterOptions?: MajorFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetMajors
  implements UseCase<Promise<Either<[Major[], PaginationOptions], Error>>, GetMajorsParams>
{
  private readonly majorRepository: MajorRepository;

  public constructor(
    @inject(SYMBOLS.MajorRepository)
    majorRepository: MajorRepository,
  ) {
    this.majorRepository = majorRepository;
  }

  public async execute(
    includeOptions?: MajorIncludeOptions,
    filterOptions?: MajorFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Major[], PaginationOptions], Error>> {
    return await this.majorRepository.getMajors(
      includeOptions,
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
