import type { PermissionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Permission } from '@app/domain/entities';

export type GetPermissionParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class GetPermission implements UseCase<
  Promise<Either<Permission, Error>>,
  GetPermissionParams
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

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<Permission, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.permissionRepository.getPermission(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
