import type { CommunityGroupAdminRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import {
  PaginationOptions,
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
  CommunityGroupAdminSortOptions,
} from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type GetCommunityGroupAdminsParams = [
  filterOptions?: CommunityGroupAdminFilterOptions,
  sortOptions?: CommunityGroupAdminSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroupAdmins implements UseCase<
  Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>>,
  GetCommunityGroupAdminsParams
> {
  private readonly communityGroupAdminRepository: CommunityGroupAdminRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CommunityGroupAdminFilterOptions,
    sortOptions?: CommunityGroupAdminSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.communityGroupAdminRepository.getCommunityGroupAdmins(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
