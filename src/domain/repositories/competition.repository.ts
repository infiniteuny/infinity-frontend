import { Either } from 'effect/Either';
import {
  PaginationOptions,
  Competition,
  CompetitionFilterOptions,
  CompetitionSortOptions,
} from '@app/domain/entities';

export interface CompetitionRepository {
  getCompetitions(
    filterOptions?: CompetitionFilterOptions,
    sortOptions?: CompetitionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Competition[], PaginationOptions], Error>>;

  getCompetition(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  createCompetition(
    competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  updateCompetition(
    id: string,
    competition: Partial<Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  deleteCompetition(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;
}
