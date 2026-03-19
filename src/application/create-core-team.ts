import type { CoreTeamRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeam } from '@app/domain/entities';

export type CreateCoreTeamParams = [
  coreTeam: Omit<CoreTeam, 'id' | 'createdAt' | 'updatedAt' | 'group'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class CreateCoreTeam
  implements UseCase<Promise<Either<CoreTeam, Error>>, CreateCoreTeamParams>
{
  private readonly coreTeamRepository: CoreTeamRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
  }

  public async execute(
    coreTeam: Omit<CoreTeam, 'id' | 'createdAt' | 'updatedAt' | 'group'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<CoreTeam, Error>> {
    return await this.coreTeamRepository.createCoreTeam(coreTeam, abortSignal, authenticate);
  }
}
