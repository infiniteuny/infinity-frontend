import type { GroupPermissionRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  GroupPermission,
  GroupPermissionFilterOptions,
  PermissionSortOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetGroupPermissionsParams = [
  groupId: string,
  filterOptions?: GroupPermissionFilterOptions,
  sortOptions?: PermissionSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetGroupPermissions implements UseCase<
  Promise<Either<[GroupPermission[], PaginationOptions], Error>>,
  GetGroupPermissionsParams
> {
  private readonly groupPermissionRepository: GroupPermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.GroupPermissionRepository)
    groupPermissionRepository: GroupPermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.groupPermissionRepository = groupPermissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    groupId: string,
    filterOptions?: GroupPermissionFilterOptions,
    sortOptions?: PermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[GroupPermission[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      const accessToken = accessTokenResult.right;

      return await this.groupPermissionRepository.getGroupPermissions(
        groupId,
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessToken,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
