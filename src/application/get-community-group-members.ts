import type { CommunityGroupMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  PaginationOptions,
  CommunityGroupMember,
  CommunityGroupMemberFilterOptions,
  CommunityGroupMemberIncludeOptions,
  CommunityGroupMemberSortOptions,
} from '@app/domain/entities';

export type GetCommunityGroupMembersParams = [
  communityGroupId: string,
  includeOptions?: CommunityGroupMemberIncludeOptions,
  filterOptions?: CommunityGroupMemberFilterOptions,
  sortOptions?: CommunityGroupMemberSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroupMembers implements UseCase<
  Promise<Either<[CommunityGroupMember[], PaginationOptions], Error>>,
  GetCommunityGroupMembersParams
> {
  private readonly communityGroupMemberRepository: CommunityGroupMemberRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupMemberRepository)
    communityGroupMemberRepository: CommunityGroupMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupMemberRepository = communityGroupMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    communityGroupId: string,
    includeOptions?: CommunityGroupMemberIncludeOptions,
    filterOptions?: CommunityGroupMemberFilterOptions,
    sortOptions?: CommunityGroupMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CommunityGroupMember[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupMemberRepository.getCommunityGroupMembers(
      communityGroupId,
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
