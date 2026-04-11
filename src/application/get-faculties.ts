import type { FacultyRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
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
    authenticate?: boolean,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>> {
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

    return await this.facultyRepository.getFaculties(
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
