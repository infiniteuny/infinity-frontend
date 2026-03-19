import type { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdmin } from '@app/domain/entities';

export type UpdateCommunityGroupAdminParams = [
  id: string,
  communityGroupAdmin: Partial<
    Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt' | 'group'>
  >,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateCommunityGroupAdmin
  implements UseCase<Promise<Either<CommunityGroupAdmin, Error>>, UpdateCommunityGroupAdminParams>
{
  private readonly communityGroupAdminRepository: CommunityGroupAdminRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
  }

  public async execute(
    id: string,
    communityGroupAdmin: Partial<
      Omit<CommunityGroupAdmin, 'id' | 'createdAt' | 'updatedAt' | 'group'>
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    return await this.communityGroupAdminRepository.updateCommunityGroupAdmin(
      id,
      communityGroupAdmin,
      abortSignal,
      authenticate,
    );
  }
}
