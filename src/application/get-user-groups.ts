import type { UserGroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { PaginationOptions, UserGroup, UserGroupFilterOptions } from '@app/domain/entities';

export type GetUserGroupsParams = [
  userId: string,
  filterOptions?: UserGroupFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetUserGroups implements UseCase<
  Promise<Either<[UserGroup[], PaginationOptions], Error>>,
  GetUserGroupsParams
> {
  private readonly userGroupRepository: UserGroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserGroupRepository)
    userGroupRepository: UserGroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userGroupRepository = userGroupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    userId: string,
    filterOptions?: UserGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[UserGroup[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userGroupRepository.getUserGroups(
        userId,
        filterOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
