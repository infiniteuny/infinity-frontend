import type { PermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Permission } from '@app/domain/entities';

export type CreatePermissionParams = [
  permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreatePermission implements UseCase<
  Promise<Either<Permission, Error>>,
  CreatePermissionParams
> {
  private readonly permissionRepository: PermissionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.PermissionRepository)
    permissionRepository: PermissionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.permissionRepository = permissionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Permission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.permissionRepository.createPermission(
        permission,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
