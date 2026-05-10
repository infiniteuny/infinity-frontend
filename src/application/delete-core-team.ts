import type { CoreTeamRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeam } from '@app/domain/entities';

export type DeleteCoreTeamParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCoreTeam implements UseCase<
  Promise<Either<CoreTeam, Error>>,
  DeleteCoreTeamParams
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

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<CoreTeam, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamRepository.deleteCoreTeam(id, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
