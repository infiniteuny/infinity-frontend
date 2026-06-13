import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionOutput,
  CompetitionOutputFilterOptions,
  CompetitionOutputSortOptions,
} from '@app/domain/entities';

export interface CompetitionOutputRepository {
  getCompetitionOutputs(
    filterOptions?: CompetitionOutputFilterOptions,
    sortOptions?: CompetitionOutputSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionOutput[], PaginationOptions], Error>>;

  getCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>>;

  createCompetitionOutput(
    competitionOutput: Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>>;

  updateCompetitionOutput(
    id: string,
    competitionOutput: Partial<Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>>;

  deleteCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionOutput, Error>>;
}
