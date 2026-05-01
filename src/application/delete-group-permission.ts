import type { GroupPermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { GroupPermission } from '@app/domain/entities';

export type DeleteGroupPermissionParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteGroupPermission implements UseCase<
  Promise<Either<GroupPermission, Error>>,
  DeleteGroupPermissionParams
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
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<GroupPermission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.groupPermissionRepository.deleteGroupPermission(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
