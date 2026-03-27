import type { PermissionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Permission } from '@app/domain/entities';

export type CreatePermissionParams = [
  permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreatePermission implements UseCase<
  Promise<Either<Permission, Error>>,
  CreatePermissionParams
> {
  private readonly permissionRepository: PermissionRepository;

  public constructor(
    @inject(SYMBOLS.PermissionRepository)
    permissionRepository: PermissionRepository,
  ) {
    this.permissionRepository = permissionRepository;
  }

  public async execute(
    permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Permission, Error>> {
    return await this.permissionRepository.createPermission(permission, abortSignal, authenticate);
  }
}
