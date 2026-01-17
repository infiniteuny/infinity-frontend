import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Group, GroupFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { GroupRepository } from '@app/domain/repositories';
import { GroupMapper } from '@app/infrastructure/dtos';

export class GroupRepositoryImpl implements GroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
    @inject(SYMBOLS.AccessTokenDataSource)
    private accessTokenDataSource: () => Promise<string>,
  ) {}

  public async getGroups(
    filterOptions?: GroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Group[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/groups', {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[guard_name]': filterOptions?.guardName,
          'filters[created_at][operator]': filterOptions?.createdAtOperator,
          'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
          'filters[updated_at][operator]': filterOptions?.updatedAtOperator,
          'filters[updated_at][value]': filterOptions?.updatedAt?.toISOString(),
        },
      });

      return right([
        response.data.data.map(GroupMapper.fromDtoToDomain),
        {
          perPage: response.data.meta.per_page,
          cursor: response.data.meta.next_cursor,
        },
      ]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(GroupMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createGroup(
    group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        '/groups',
        GroupMapper.fromDomaintoDto(group),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(GroupMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateGroup(
    id: string,
    group: Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.put(
        `/groups/${id}`,
        GroupMapper.fromDomaintoDto(group),
        {
          signal: abortSignal,
          headers: {
            ...(authenticate
              ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
              : {}),
          },
        },
      );

      return right(GroupMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteGroup(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Group, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(authenticate
            ? { Authorization: `Bearer ${await this.accessTokenDataSource()}` }
            : {}),
        },
      });

      return right(GroupMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
