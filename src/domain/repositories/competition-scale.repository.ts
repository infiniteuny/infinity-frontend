import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionScale,
  CompetitionScaleFilterOptions,
} from '@app/domain/entities';

export interface CompetitionScaleRepository {
  getCompetitionScales(
    filterOptions?: CompetitionScaleFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionScale[], PaginationOptions], Error>>;

  getCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionScale, Error>>;

  createCompetitionScale(
    competitionScale: Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionScale, Error>>;

  updateCompetitionScale(
    id: string,
    competitionScale: Partial<Omit<CompetitionScale, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionScale, Error>>;

  deleteCompetitionScale(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionScale, Error>>;
}
