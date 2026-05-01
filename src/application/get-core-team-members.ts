import type { CoreTeamMemberRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import {
  PaginationOptions,
  CoreTeamMember,
  CoreTeamMemberFilterOptions,
  CoreTeamMemberIncludeOptions,
} from '@app/domain/entities';

export type GetCoreTeamMembersParams = [
  coreTeamId: string,
  includeOptions?: CoreTeamMemberIncludeOptions,
  filterOptions?: CoreTeamMemberFilterOptions,
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
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamMemberRepository)
    coreTeamMemberRepository: CoreTeamMemberRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamMemberRepository = coreTeamMemberRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    coreTeamId: string,
    includeOptions?: CoreTeamMemberIncludeOptions,
    filterOptions?: CoreTeamMemberFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[CoreTeamMember[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
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
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
