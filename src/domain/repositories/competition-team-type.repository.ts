import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
} from '@app/domain/entities';

export interface CompetitionTeamTypeRepository {
  getCompetitionTeamTypes(
    filterOptions?: CompetitionTeamTypeFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[CompetitionTeamType[], PaginationOptions], Error>>;

  getCompetitionTeamType(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTeamType, Error>>;

  createCompetitionTeamType(
    competitionTeamType: Omit<CompetitionTeamType, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTeamType, Error>>;

  updateCompetitionTeamType(
    id: string,
    competitionTeamType: Partial<Omit<CompetitionTeamType, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTeamType, Error>>;

  deleteCompetitionTeamType(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<CompetitionTeamType, Error>>;
}
