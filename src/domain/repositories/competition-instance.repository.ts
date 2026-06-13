import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceIncludeOptions,
  CompetitionInstanceSortOptions,
} from '@app/domain/entities';

export interface CompetitionInstanceRepository {
  getCompetitionInstances(
    includeOptions?: CompetitionInstanceIncludeOptions,
    filterOptions?: CompetitionInstanceFilterOptions,
    sortOptions?: CompetitionInstanceSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionInstance[], PaginationOptions], Error>>;

  getCompetitionInstance(
    id: string,
    includeOptions?: CompetitionInstanceIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>>;

  createCompetitionInstance(
    competitionInstance: Omit<
      CompetitionInstance,
      'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>>;

  updateCompetitionInstance(
    id: string,
    competitionInstance: Partial<
      Omit<CompetitionInstance, 'id' | 'createdAt' | 'updatedAt' | 'competition' | 'organizerType'>
    >,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>>;

  deleteCompetitionInstance(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionInstance, Error>>;
}
