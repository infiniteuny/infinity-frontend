import type { CommunityGroupRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  CommunityGroup,
  CommunityGroupFilterOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetCommunityGroupsParams = [
  filterOptions?: CommunityGroupFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroups implements UseCase<
  Promise<Either<[CommunityGroup[], PaginationOptions], Error>>,
  GetCommunityGroupsParams
> {
  private readonly communityGroupRepository: CommunityGroupRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupRepository)
    communityGroupRepository: CommunityGroupRepository,
  ) {
    this.communityGroupRepository = communityGroupRepository;
  }

  public async execute(
    filterOptions?: CommunityGroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[CommunityGroup[], PaginationOptions], Error>> {
    return await this.communityGroupRepository.getCommunityGroups(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
