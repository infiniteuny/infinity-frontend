import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionOutput,
  CompetitionOutputFilterOptions,
} from '@app/domain/entities';

export interface CompetitionOutputRepository {
  getCompetitionOutputs(
    filterOptions?: CompetitionOutputFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionOutput[], PaginationOptions], Error>>;

  getCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOutput, Error>>;

  createCompetitionOutput(
    competitionOutput: Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOutput, Error>>;

  updateCompetitionOutput(
    id: string,
    competitionOutput: Partial<Omit<CompetitionOutput, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOutput, Error>>;

  deleteCompetitionOutput(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOutput, Error>>;
}
