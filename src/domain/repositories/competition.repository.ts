import { Either } from 'effect/Either';
import {
  PaginationOptions,
  Competition,
  CompetitionFilterOptions,
  CompetitionIncludeOptions,
} from '@app/domain/entities';

export interface CompetitionRepository {
  getCompetitions(
    includeOptions?: CompetitionIncludeOptions,
    filterOptions?: CompetitionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Competition[], PaginationOptions], Error>>;

  getCompetition(
    id: string,
    includeOptions?: CompetitionIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  createCompetition(
    competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'organizerType'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  updateCompetition(
    id: string,
    competition: Partial<Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'organizerType'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;

  deleteCompetition(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Competition, Error>>;
}
