import type { FacultyRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, Faculty, FacultyFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetFacultiesParams = [
  filterOptions?: FacultyFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetFaculties implements UseCase<
  Promise<Either<[Faculty[], PaginationOptions], Error>>,
  GetFacultiesParams
> {
  private readonly facultyRepository: FacultyRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.FacultyRepository)
    facultyRepository: FacultyRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.facultyRepository = facultyRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: FacultyFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.facultyRepository.getFaculties(
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
