import type { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdmin } from '@app/domain/entities';

export type CreateCommunityGroupAdminParams = [
  communityGroupAdmin: Omit<
    CommunityGroupAdmin,
    'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
  >,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateCommunityGroupAdmin
  implements UseCase<Promise<Either<CommunityGroupAdmin, Error>>, CreateCommunityGroupAdminParams>
{
  private readonly communityGroupAdminRepository: CommunityGroupAdminRepository;

  public constructor(
    @inject(SYMBOLS.CommunityGroupAdminRepository)
    communityGroupAdminRepository: CommunityGroupAdminRepository,
  ) {
    this.communityGroupAdminRepository = communityGroupAdminRepository;
  }

  public async execute(
    communityGroupAdmin: Omit<
      CommunityGroupAdmin,
      'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'
    >,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    return await this.communityGroupAdminRepository.createCommunityGroupAdmin(
      communityGroupAdmin,
      abortSignal,
      authenticate,
    );
  }
}
