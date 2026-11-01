import type { UserGroupRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { UserGroup } from '@infiniteuny/infinity-domain';

export type DeleteUserGroupParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteUserGroup implements UseCase<
  Promise<Either<UserGroup, Error>>,
  DeleteUserGroupParams
> {
  private readonly userGroupRepository: UserGroupRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserGroupRepository)
    userGroupRepository: UserGroupRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userGroupRepository = userGroupRepository;
    this.authRepository = authRepository;
  }

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<UserGroup, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userGroupRepository.deleteUserGroup(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
