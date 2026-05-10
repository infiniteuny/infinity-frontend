import type { GroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Group } from '@app/domain/entities';

export type DeleteGroupParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteGroup implements UseCase<Promise<Either<Group, Error>>, DeleteGroupParams> {
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

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<Group, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.groupRepository.deleteGroup(id, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
