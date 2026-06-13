import type { UserCommunityGroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  CommunityGroupSortOptions,
  PaginationOptions,
  UserCommunityGroup,
  UserCommunityGroupFilterOptions,
} from '@app/domain/entities';

export type GetUserCommunityGroupsParams = [
  userId: string,
  filterOptions?: UserCommunityGroupFilterOptions,
  sortOptions?: CommunityGroupSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetUserCommunityGroups implements UseCase<
  Promise<Either<[UserCommunityGroup[], PaginationOptions], Error>>,
  GetUserCommunityGroupsParams
> {
  private readonly userCommunityGroupRepository: UserCommunityGroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserCommunityGroupRepository)
    userCommunityGroupRepository: UserCommunityGroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userCommunityGroupRepository = userCommunityGroupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    userId: string,
    filterOptions?: UserCommunityGroupFilterOptions,
    sortOptions?: CommunityGroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[UserCommunityGroup[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.userCommunityGroupRepository.getUserCommunityGroups(
      userId,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
