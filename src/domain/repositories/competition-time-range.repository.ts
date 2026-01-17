import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
} from '@app/domain/entities';

export interface CompetitionTimeRangeRepository {
  getCompetitionTimeRanges(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>>;

  getCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  createCompetitionTimeRange(
    competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  updateCompetitionTimeRange(
    id: string,
    competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  deleteCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionTimeRange, Error>>;
}
