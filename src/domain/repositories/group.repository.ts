import {
  PaginationOptions,
  Group,
  GroupFilterOptions,
  GroupSortOptions,
} from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface GroupRepository {
  getGroups(
    filterOptions?: GroupFilterOptions,
    sortOptions?: GroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Group[], PaginationOptions], Error>>;

  getGroup(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<Group, Error>>;

  createGroup(
    group: Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>>;

  updateGroup(
    id: string,
    group: Partial<Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>>;

  deleteGroup(id: string, abortSignal?: AbortSignal, token?: string): Promise<Either<Group, Error>>;
}
