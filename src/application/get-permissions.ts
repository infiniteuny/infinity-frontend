import type { PermissionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, Permission, PermissionFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetPermissionsParams = [
  filterOptions?: PermissionFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetPermissions
  implements
    UseCase<Promise<Either<[Permission[], PaginationOptions], Error>>, GetPermissionsParams>
{
  private readonly permissionRepository: PermissionRepository;

  public constructor(
    @inject(SYMBOLS.PermissionRepository)
    permissionRepository: PermissionRepository,
  ) {
    this.permissionRepository = permissionRepository;
  }

  public async execute(
    filterOptions?: PermissionFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Permission[], PaginationOptions], Error>> {
    return await this.permissionRepository.getPermissions(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
