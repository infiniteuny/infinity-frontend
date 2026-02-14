import type { GroupRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, Group, GroupFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetGroupsParams = [
  filterOptions?: GroupFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetGroups
  implements UseCase<Promise<Either<[Group[], PaginationOptions], Error>>, GetGroupsParams>
{
  private readonly groupRepository: GroupRepository;

  public constructor(
    @inject(SYMBOLS.GroupRepository)
    groupRepository: GroupRepository,
  ) {
    this.groupRepository = groupRepository;
  }

  public async execute(
    filterOptions?: GroupFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Group[], PaginationOptions], Error>> {
    return await this.groupRepository.getGroups(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
