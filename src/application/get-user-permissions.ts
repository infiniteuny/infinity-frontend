import type { UserPermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  PermissionSortOptions,
  UserPermission,
  UserPermissionFilterOptions,
  UserPermissionIncludeOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetUserPermissionsParams =
  | [userId: string, includeOptions: UserPermissionIncludeOptions, abortSignal?: AbortSignal]
  | [
      userId: string,
      filterOptions?: UserPermissionFilterOptions,
      sortOptions?: PermissionSortOptions,
      paginationOptions?: PaginationOptions,
      abortSignal?: AbortSignal,
    ];

@injectable()
export class GetUserPermissions implements UseCase<
  Promise<Either<[UserPermission[], PaginationOptions] | UserPermission[], Error>>,
  GetUserPermissionsParams
> {
  private readonly userPermissionRepository: UserPermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserPermissionRepository)
    userPermissionRepository: UserPermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userPermissionRepository = userPermissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    userId: string,
    includeOptions: UserPermissionIncludeOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<UserPermission[], Error>>;
  public async execute(
    userId: string,
    filterOptions?: UserPermissionFilterOptions,
    sortOptions?: PermissionSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[UserPermission[], PaginationOptions], Error>>;
  public async execute(
    userId: string,
    includeOptionsOrFilterOptions?: UserPermissionIncludeOptions | UserPermissionFilterOptions,
    sortOptionsOrAbortSignal?: PermissionSortOptions | AbortSignal,
    paginationOptionsOrAbortSignal?: PaginationOptions | AbortSignal,
    abortSignal?: AbortSignal,
  ): Promise<Either<[UserPermission[], PaginationOptions] | UserPermission[], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      const hasIncludeOptions = Array.isArray(includeOptionsOrFilterOptions);

      if (hasIncludeOptions) {
        return await this.userPermissionRepository.getUserPermissions(
          userId,
          includeOptionsOrFilterOptions as UserPermissionIncludeOptions,
          sortOptionsOrAbortSignal as AbortSignal | undefined,
          accessTokenResult.right,
        );
      } else {
        return await this.userPermissionRepository.getUserPermissions(
          userId,
          includeOptionsOrFilterOptions as UserPermissionFilterOptions | undefined,
          sortOptionsOrAbortSignal as PermissionSortOptions | undefined,
          paginationOptionsOrAbortSignal as PaginationOptions | undefined,
          abortSignal,
          accessTokenResult.right,
        );
      }
    } else {
      return left(accessTokenResult.left);
    }
  }
}
