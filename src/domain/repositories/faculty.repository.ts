import {
  PaginationOptions,
  Faculty,
  FacultyFilterOptions,
  FacultySortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface FacultyRepository {
  getFaculties(
    filterOptions?: FacultyFilterOptions,
    sortOptions?: FacultySortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Faculty[], PaginationOptions], Error>>;

  getFaculty(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Faculty, Error>>;

  createFaculty(
    user: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Faculty, Error>>;

  updateFaculty(
    id: string,
    user: Partial<Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Faculty, Error>>;

  deleteFaculty(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Faculty, Error>>;
}
