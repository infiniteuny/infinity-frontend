import type { PermissionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Permission } from '@app/domain/entities';

export type UpdatePermissionParams = [
  id: string,
  permission: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdatePermission implements UseCase<
  Promise<Either<Permission, Error>>,
  UpdatePermissionParams
> {
  private readonly permissionRepository: PermissionRepository;

  public constructor(
    @inject(SYMBOLS.PermissionRepository)
    permissionRepository: PermissionRepository,
  ) {
    this.permissionRepository = permissionRepository;
  }

  public async execute(
    id: string,
    permission: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Permission, Error>> {
    return await this.permissionRepository.updatePermission(
      id,
      permission,
      abortSignal,
      authenticate,
    );
  }
}
