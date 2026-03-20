import type { CoreTeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeam } from '@app/domain/entities';

export type UpdateCoreTeamParams = [
  id: string,
  coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateCoreTeam
  implements UseCase<Promise<Either<CoreTeam, Error>>, UpdateCoreTeamParams>
{
  private readonly coreTeamRepository: CoreTeamRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
  }

  public async execute(
    id: string,
    coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>> {
    return await this.coreTeamRepository.updateCoreTeam(id, coreTeam, abortSignal, authenticate);
  }
}
