import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionScale,
  CompetitionScaleFilterOptions,
  CompetitionScaleSortOptions,
} from '@app/domain/entities';

export interface CompetitionScaleRepository {
  getCompetitionScales(
    filterOptions?: CompetitionScaleFilterOptions,
    sortOptions?: CompetitionScaleSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>>;

  getCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>>;

  createCompetitionScale(
    competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>>;

  updateCompetitionScale(
    id: string,
    competitionScale: Partial<Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>>;

  deleteCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionScale, Error>>;
}
