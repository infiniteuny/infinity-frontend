import type { CommunityGroupAdminMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  PaginationOptions,
  CommunityGroupAdminMember,
  CommunityGroupAdminMemberFilterOptions,
  CommunityGroupAdminMemberIncludeOptions,
  CommunityGroupAdminMemberSortOptions,
} from '@app/domain/entities';

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
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminMemberRepository)
    communityGroupAdminMemberRepository: CommunityGroupAdminMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
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

    if (authenticate) {
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
