import type { UserPermissionRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { UserPermission } from '@app/domain/entities';

export type GetUserPermissionsWithTokenParams = [
  userId: string,
  abortSignal?: AbortSignal,
  token?: string,
];

@injectable()
export class GetUserPermissionsWithToken implements UseCase<
  Promise<Either<UserPermission[], Error>>,
  GetUserPermissionsWithTokenParams
> {
  private readonly userPermissionRepository: UserPermissionRepository;

  public constructor(
    @inject(SYMBOLS.UserPermissionRepository)
    userPermissionRepository: UserPermissionRepository,
  ) {
    this.userPermissionRepository = userPermissionRepository;
  }

  public async execute(
    userId: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<UserPermission[], Error>> {
    return await this.userPermissionRepository.getUserPermissions(userId, abortSignal, token);
  }
}
