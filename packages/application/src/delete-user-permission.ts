import type { UserPermissionRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { UserPermission } from '@infiniteuny/infinity-domain';

export type DeleteUserPermissionParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteUserPermission implements UseCase<
  Promise<Either<UserPermission, Error>>,
  DeleteUserPermissionParams
> {
  private readonly userPermissionRepository: UserPermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.UserPermissionRepository)
    userPermissionRepository: UserPermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.userPermissionRepository = userPermissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<UserPermission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userPermissionRepository.deleteUserPermission(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
