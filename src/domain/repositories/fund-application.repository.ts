import { Either } from 'effect/Either';
import {
  PaginationOptions,
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationIncludeOptions,
} from '@app/domain/entities';

export interface FundApplicationRepository {
  getFundApplications(
    includeOptions?: FundApplicationIncludeOptions,
    filterOptions?: FundApplicationFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[FundApplication[], PaginationOptions], Error>>;

  getFundApplication(
    id: string,
    includeOptions?: FundApplicationIncludeOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>>;

  createFundApplication(
    fundApplication: Omit<
      FundApplication,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'team'
      | 'competition'
      | 'competitionTeamType'
      | 'competitionScale'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>>;

  updateFundApplication(
    id: string,
    fundApplication: Partial<
      Omit<
        FundApplication,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'team'
        | 'competition'
        | 'competitionTeamType'
        | 'competitionScale'
      >
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>>;

  deleteFundApplication(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<FundApplication, Error>>;
}
