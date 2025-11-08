import { PaginationOptions, Degree, DegreeFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface DegreeRepository {
  getFaculties(
    filterOptions?: DegreeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Degree[], PaginationOptions], Error>>;

  getDegree(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Degree, Error>>;

  createDegree(
    user: Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Degree, Error>>;

  updateDegree(
    id: string,
    user: Partial<Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Degree, Error>>;

  deleteDegree(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Degree, Error>>;
}
