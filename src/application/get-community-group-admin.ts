import type { CommunityGroupAdminRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CommunityGroupAdmin } from '@app/domain/entities';

export type GetCommunityGroupAdminParams = [
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetCommunityGroupAdmin
  implements UseCase<Promise<Either<CommunityGroupAdmin, Error>>, GetCommunityGroupAdminParams>
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
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CommunityGroupAdmin, Error>> {
    return await this.communityGroupAdminRepository.getCommunityGroupAdmin(
      id,
      abortSignal,
      authenticate,
    );
  }
}
