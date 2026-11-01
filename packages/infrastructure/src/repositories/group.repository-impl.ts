import type { InfinityApiDataSource } from '../datasources/server';
import { Either, left, right } from 'effect/Either';
import {
  Group,
  GroupFilterOptions,
  GroupSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import { GroupMapper } from '../dtos';
import { GroupRepository } from '@infiniteuny/infinity-domain';
import { handleAxiosError } from '@infiniteuny/infinity-utils';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';

@injectable()
export class GroupRepositoryImpl implements GroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getGroups(
    filterOptions?: GroupFilterOptions,
    sortOptions?: GroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Group[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/groups', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[guard_name]': filterOptions?.guardName,
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
              : undefined,
          sorts: sortOptions
            ? Object.entries(sortOptions)
                .map((sortOption) => {
                  const prefix = sortOption[1] === 'DESC' ? '-' : '';
                  const field = sortOption[0]
                    .split(/(?=[A-Z])/)
                    .join('_')
                    .toLowerCase();
                  return prefix + field;
                })
                .join(',')
            : undefined,
        },
      });

      const groupsResponse = response.data.data.groups.map(GroupMapper.fromDtoToDomain);

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([groupsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const groupResponse = GroupMapper.fromDtoToDomain(response.data.data.group);

      return right(groupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createGroup(
    group: Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/groups',
        GroupMapper.fromDomainToDto(group),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const groupResponse = GroupMapper.fromDtoToDomain(response.data.data.group);

      return right(groupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateGroup(
    id: string,
    group: Partial<Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/groups/${id}`,
        GroupMapper.fromDomainToDto(group),
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const groupResponse = GroupMapper.fromDtoToDomain(response.data.data.group);

      return right(groupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const groupResponse = GroupMapper.fromDtoToDomain(response.data.data.group);

      return right(groupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
