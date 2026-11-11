import type {
  CommunityGroupAdminMemberRepository,
  AuthRepository,
} from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import {
  PaginationOptions,
  CommunityGroupAdminMember,
  CommunityGroupAdminMemberFilterOptions,
  CommunityGroupAdminMemberIncludeOptions,
  CommunityGroupAdminMemberSortOptions,
} from '@infiniteuny/infinity-domain';

export type GetCommunityGroupAdminMembersParams = [
  communityGroupAdminId: string,
  includeOptions?: CommunityGroupAdminMemberIncludeOptions,
  filterOptions?: CommunityGroupAdminMemberFilterOptions,
  sortOptions?: CommunityGroupAdminMemberSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroupAdminMembers implements UseCase<
  Promise<Either<[CommunityGroupAdminMember[], PaginationOptions], Error>>,
  GetCommunityGroupAdminMembersParams
> {
  private readonly communityGroupAdminMemberRepository: CommunityGroupAdminMemberRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminMemberRepository)
    communityGroupAdminMemberRepository: CommunityGroupAdminMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.communityGroupAdminMemberRepository = communityGroupAdminMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    communityGroupAdminId: string,
    includeOptions?: CommunityGroupAdminMemberIncludeOptions,
    filterOptions?: CommunityGroupAdminMemberFilterOptions,
    sortOptions?: CommunityGroupAdminMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CommunityGroupAdminMember[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupAdminMemberRepository.getCommunityGroupAdminMembers(
      communityGroupAdminId,
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
