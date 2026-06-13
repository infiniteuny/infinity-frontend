import type { GroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Group,
  GroupFilterOptions,
  GroupSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetGroupsParams = [
  filterOptions?: GroupFilterOptions,
  sortOptions?: GroupSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
];

@injectable()
export class GetGroups implements UseCase<
  Promise<Either<[Group[], PaginationOptions], Error>>,
  GetGroupsParams
> {
  private readonly groupRepository: GroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.GroupRepository)
    groupRepository: GroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.groupRepository = groupRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    filterOptions?: GroupFilterOptions,
    sortOptions?: GroupSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
  ): Promise<Either<[Group[], PaginationOptions], Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.groupRepository.getGroups(
        filterOptions,
        sortOptions,
        paginationOptions,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
