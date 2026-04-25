import { UserGroup } from '@app/domain/entities';
import { Either } from 'effect/Either';

export interface UserGroupRepository {
  getUserGroups(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup[], Error>>;

  getUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;

  createUserGroup(
    userId: string,
    userGroup: { groupId: string },
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;

  deleteUserGroup(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserGroup, Error>>;
}
