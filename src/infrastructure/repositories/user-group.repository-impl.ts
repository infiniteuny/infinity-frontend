import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { UserGroup } from '@app/domain/entities';
import { UserGroupMapper } from '@app/infrastructure/dtos';
import { UserGroupRepository } from '@app/domain/repositories';
import { SYMBOLS } from '@config';

export class UserGroupRepositoryImpl implements UserGroupRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getUserGroups(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup[], Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/users/${userId}/groups`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userGroupsResponse = response.data.data.user_groups.map(
        UserGroupMapper.fromDtoToDomain,
      );

      return right(userGroupsResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/user-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createUserGroup(
    userId: string,
    userGroup: { groupId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.post(
        `/users/${userId}/groups`,
        {
          group_id: userGroup.groupId,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/user-groups/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const userGroupResponse = UserGroupMapper.fromDtoToDomain(response.data.data.user_group);

      return right(userGroupResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
