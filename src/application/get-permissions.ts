import type { PermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Permission,
  PermissionFilterOptions,
  PermissionSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetPermissionsParams = [
  filterOptions?: PermissionFilterOptions,
  sortOptions?: PermissionSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetPermissions implements UseCase<
  Promise<Either<[Permission[], PaginationOptions], Error>>,
  GetPermissionsParams
> {
  private readonly permissionRepository: PermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.PermissionRepository)
    permissionRepository: PermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.permissionRepository = permissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: PermissionFilterOptions,
    sortOptions?: PermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[Permission[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.permissionRepository.getPermissions(
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
