import type { FacultyRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, Faculty, FacultyFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetFacultiesParams = [
  filterOptions?: FacultyFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetFaculties implements UseCase<
  Promise<Either<[Faculty[], PaginationOptions], Error>>,
  GetFacultiesParams
> {
  private readonly facultyRepository: FacultyRepository;

  public constructor(
    @inject(SYMBOLS.FacultyRepository)
    facultyRepository: FacultyRepository,
  ) {
    this.facultyRepository = facultyRepository;
  }

  public async execute(
    filterOptions?: FacultyFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>> {
    return await this.facultyRepository.getFaculties(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
