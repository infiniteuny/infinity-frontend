import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionOrganizerType,
  CompetitionOrganizerTypeFilterOptions,
} from '@app/domain/entities';

export interface CompetitionOrganizerTypeRepository {
  getCompetitionOrganizerTypes(
    filterOptions?: CompetitionOrganizerTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionOrganizerType[], PaginationOptions], Error>>;

  getCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOrganizerType, Error>>;

  createCompetitionOrganizerType(
    competitionOrganizerType: Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOrganizerType, Error>>;

  updateCompetitionOrganizerType(
    id: string,
    competitionOrganizerType: Partial<
      Omit<CompetitionOrganizerType, 'id' | 'createdAt' | 'updatedAt'>
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOrganizerType, Error>>;

  deleteCompetitionOrganizerType(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionOrganizerType, Error>>;
}
