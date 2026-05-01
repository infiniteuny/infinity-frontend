import type { UserGroupRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { UserGroup } from '@app/domain/entities';

export type CreateUserGroupParams = [
  userId: string,
  userGroup: { groupId: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateUserGroup implements UseCase<
  Promise<Either<UserGroup, Error>>,
  CreateUserGroupParams
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

  public async execute(
    userId: string,
    userGroup: { groupId: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<UserGroup, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userGroupRepository.createUserGroup(
        userId,
        userGroup,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
