import type { CommunityGroupAdminRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCommunityGroupAdminsParams = [
  filterOptions?: CommunityGroupAdminFilterOptions,
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
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: CommunityGroupAdminFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.communityGroupAdminRepository.getCommunityGroupAdmins(
      filterOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
