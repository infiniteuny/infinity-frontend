import type { CoreTeamDivisionRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { CoreTeamDivision } from '@infiniteuny/infinity-domain';

export type DeleteCoreTeamDivisionParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class DeleteCoreTeamDivision implements UseCase<
  Promise<Either<CoreTeamDivision, Error>>,
  DeleteCoreTeamDivisionParams
> {
  private readonly coreTeamDivisionRepository: CoreTeamDivisionRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.CoreTeamDivisionRepository)
    coreTeamDivisionRepository: CoreTeamDivisionRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.coreTeamDivisionRepository = coreTeamDivisionRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
  ): Promise<Either<CoreTeamDivision, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamDivisionRepository.deleteCoreTeamDivision(
        id,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
