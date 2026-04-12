import type { CoreTeamRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
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
export class UpdateCoreTeam implements UseCase<
  Promise<Either<CoreTeam, Error>>,
  UpdateCoreTeamParams
> {
  private readonly coreTeamRepository: CoreTeamRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamRepository)
    coreTeamRepository: CoreTeamRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamRepository = coreTeamRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    coreTeam: Partial<Omit<CoreTeam, 'id' | 'groupId' | 'createdAt' | 'updatedAt' | 'group'>>,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<CoreTeam, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.coreTeamRepository.updateCoreTeam(id, coreTeam, abortSignal, accessToken);
  }
}
