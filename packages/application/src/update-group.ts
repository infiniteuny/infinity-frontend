import type { GroupRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Group } from '@infiniteuny/infinity-domain';

export type UpdateGroupParams = [
  id: string,
  group: Partial<Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateGroup implements UseCase<Promise<Either<Group, Error>>, UpdateGroupParams> {
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
    id: string,
    group: Partial<Omit<Group, 'id' | 'isManaged' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Group, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.groupRepository.updateGroup(
        id,
        group,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
