import type { UserPermissionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  PaginationOptions,
  UserPermission,
  UserPermissionFilterOptions,
  UserPermissionIncludeOptions,
  UserPermissionSortOptions,
} from '@app/domain/entities';

export type GetUserPermissionsWithTokenParams =
  | [
      userId: string,
      includeOptions: UserPermissionIncludeOptions,
      abortSignal?: AbortSignal,
      token?: string,
    ]
  | [
      userId: string,
      filterOptions?: UserPermissionFilterOptions,
      sortOptions?: UserPermissionSortOptions,
      paginationOptions?: PaginationOptions,
      abortSignal?: AbortSignal,
      token?: string,
    ];

@injectable()
export class GetUserPermissionsWithToken implements UseCase<
  Promise<Either<[UserPermission[], PaginationOptions] | UserPermission[], Error>>,
  GetUserPermissionsWithTokenParams
> {
  private readonly userPermissionRepository: UserPermissionRepository;

  public constructor(
    @inject(SYMBOLS.UserPermissionRepository)
    userPermissionRepository: UserPermissionRepository,
  ) {
    this.userPermissionRepository = userPermissionRepository;
  }

  public async execute(
    userId: string,
    includeOptions: UserPermissionIncludeOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>>;
  public async execute(
    userId: string,
    filterOptions?: UserPermissionFilterOptions,
    sortOptions?: UserPermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[UserPermission[], PaginationOptions], Error>>;
  public async execute(
    userId: string,
    includeOptionsOrFilterOptions?: UserPermissionIncludeOptions | UserPermissionFilterOptions,
    sortOrAbortOrPagination?: AbortSignal | PaginationOptions | UserPermissionSortOptions,
    tokenOrAbortOrPagination?: AbortSignal | PaginationOptions | string,
    tokenOrAbort?: AbortSignal | string,
    token?: string,
  ): Promise<Either<[UserPermission[], PaginationOptions] | UserPermission[], Error>> {
    const hasIncludeOptions = Array.isArray(includeOptionsOrFilterOptions);

    if (hasIncludeOptions) {
      return await this.userPermissionRepository.getUserPermissions(
        userId,
        includeOptionsOrFilterOptions as UserPermissionIncludeOptions,
        sortOrAbortOrPagination as AbortSignal | undefined,
        tokenOrAbortOrPagination as string | undefined,
      );
    } else {
      return await this.userPermissionRepository.getUserPermissions(
        userId,
        includeOptionsOrFilterOptions as UserPermissionFilterOptions | undefined,
        sortOrAbortOrPagination as UserPermissionSortOptions | undefined,
        tokenOrAbortOrPagination as PaginationOptions | undefined,
        tokenOrAbort as AbortSignal | undefined,
        token,
      );
    }
  }
}
