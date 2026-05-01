import type { UserPermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { UserPermission } from '@app/domain/entities';

export type CreateUserPermissionParams = [
  userId: string,
  userPermission: { permissionId: string },
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateUserPermission implements UseCase<
  Promise<Either<UserPermission, Error>>,
  CreateUserPermissionParams
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
    userId: string,
    userPermission: { permissionId: string },
    abortSignal?: AbortSignal,
  ): Promise<Either<UserPermission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.userPermissionRepository.createUserPermission(
        userId,
        userPermission,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
