import type { CoreTeamMemberRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import {
  PaginationOptions,
  CoreTeamMember,
  CoreTeamMemberFilterOptions,
  CoreTeamMemberIncludeOptions,
  CoreTeamMemberSortOptions,
} from '@infiniteuny/infinity-domain';

export type GetCoreTeamMembersParams = [
  coreTeamId: string,
  includeOptions?: CoreTeamMemberIncludeOptions,
  filterOptions?: CoreTeamMemberFilterOptions,
  sortOptions?: CoreTeamMemberSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCoreTeamMembers implements UseCase<
  Promise<Either<[CoreTeamMember[], PaginationOptions], Error>>,
  GetCoreTeamMembersParams
> {
  private readonly coreTeamMemberRepository: CoreTeamMemberRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamMemberRepository)
    coreTeamMemberRepository: CoreTeamMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.coreTeamMemberRepository = coreTeamMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    coreTeamId: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    filterOptions?: CoreTeamMemberFilterOptions,
    sortOptions?: CoreTeamMemberSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CoreTeamMember[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.coreTeamMemberRepository.getCoreTeamMembers(
      coreTeamId,
      includeOptions,
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
