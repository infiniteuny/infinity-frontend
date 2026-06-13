import {
  PaginationOptions,
  Degree,
  DegreeFilterOptions,
  DegreeSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface DegreeRepository {
  getDegrees(
    filterOptions?: DegreeFilterOptions,
    sortOptions?: DegreeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Degree[], PaginationOptions], Error>>;

  getDegree(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<Degree, Error>>;

  createDegree(
    user: Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>>;

  updateDegree(
    id: string,
    user: Partial<Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>>;

  deleteDegree(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Degree, Error>>;
}
