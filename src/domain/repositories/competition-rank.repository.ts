import { Either } from 'effect/Either';
import {
  PaginationOptions,
  CompetitionRank,
  CompetitionRankFilterOptions,
} from '@app/domain/entities';

export interface CompetitionRankRepository {
  getCompetitionRanks(
    filterOptions?: CompetitionRankFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CompetitionRank[], PaginationOptions], Error>>;

  getCompetitionRank(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionRank, Error>>;

  createCompetitionRank(
    competitionRank: Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionRank, Error>>;

  updateCompetitionRank(
    id: string,
    competitionRank: Partial<Omit<CompetitionRank, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionRank, Error>>;

  deleteCompetitionRank(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CompetitionRank, Error>>;
}
