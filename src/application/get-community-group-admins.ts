import type { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
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

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
  }

  public async execute(
    filterOptions?: CommunityGroupAdminFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CommunityGroupAdmin[], PaginationOptions], Error>> {
    return await this.communityGroupAdminRepository.getCommunityGroupAdmins(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
