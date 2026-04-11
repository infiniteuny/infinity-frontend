import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { Group, GroupFilterOptions, PaginationOptions } from '@app/domain/entities';
import { GroupMapper } from '@app/infrastructure/dtos';
import { GroupRepository } from '@app/domain/repositories';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';

export class GroupRepositoryImpl implements GroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getGroups(
    filterOptions?: GroupFilterOptions,
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
    group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/groups',
        GroupMapper.fromDomaintoDto(group),
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
    group: Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/groups/${id}`,
        GroupMapper.fromDomaintoDto(group),
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
