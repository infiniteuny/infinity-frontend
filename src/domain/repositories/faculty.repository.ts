import { PaginationOptions, Faculty, FacultyFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface FacultyRepository {
  getFaculties(
    filterOptions?: FacultyFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>>;

  getFaculty(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Faculty, Error>>;

  createFaculty(
    user: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Faculty, Error>>;

  updateFaculty(
    id: string,
    user: Partial<Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Faculty, Error>>;

  deleteFaculty(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Faculty, Error>>;
}
