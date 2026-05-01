import type { GroupPermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { GroupPermission } from '@app/domain/entities';

export type CreateGroupPermissionParams = [
  groupId: string,
  groupPermission: { permissionId: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateGroupPermission implements UseCase<
  Promise<Either<GroupPermission, Error>>,
  CreateGroupPermissionParams
> {
  private readonly groupPermissionRepository: GroupPermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.GroupPermissionRepository)
    groupPermissionRepository: GroupPermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.groupPermissionRepository = groupPermissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    groupId: string,
    groupPermission: { permissionId: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<GroupPermission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.groupPermissionRepository.createGroupPermission(
        groupId,
        groupPermission,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
