import type { GroupRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Group } from '@app/domain/entities';

export type CreateGroupParams = [
  group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateGroup implements UseCase<Promise<Either<Group, Error>>, CreateGroupParams> {
  private readonly groupRepository: GroupRepository;

  public constructor(
    @inject(SYMBOLS.GroupRepository)
    groupRepository: GroupRepository,
  ) {
    this.groupRepository = groupRepository;
  }

  public async execute(
    group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Group, Error>> {
    return await this.groupRepository.createGroup(group, abortSignal, authenticate);
  }
}
