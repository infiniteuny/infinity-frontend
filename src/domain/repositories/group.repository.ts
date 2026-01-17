import { PaginationOptions, Group, GroupFilterOptions } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface GroupRepository {
  getGroups(
    filterOptions?: GroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Group[], PaginationOptions], Error>>;

  getGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>>;

  createGroup(
    group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>>;

  updateGroup(
    id: string,
    group: Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>>;

  deleteGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>>;
}
