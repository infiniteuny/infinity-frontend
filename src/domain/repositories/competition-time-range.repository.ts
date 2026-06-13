import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionTimeRange,
  CompetitionTimeRangeFilterOptions,
  CompetitionTimeRangeSortOptions,
} from '@app/domain/entities';

export interface CompetitionTimeRangeRepository {
  getCompetitionTimeRanges(
    filterOptions?: CompetitionTimeRangeFilterOptions,
    sortOptions?: CompetitionTimeRangeSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionTimeRange[], PaginationOptions], Error>>;

  getCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  createCompetitionTimeRange(
    competitionTimeRange: Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  updateCompetitionTimeRange(
    id: string,
    competitionTimeRange: Partial<Omit<CompetitionTimeRange, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>>;

  deleteCompetitionTimeRange(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTimeRange, Error>>;
}
