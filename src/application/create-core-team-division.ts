import type { CoreTeamDivisionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeamDivision } from '@app/domain/entities';

export type CreateCoreTeamDivisionParams = [
  coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateCoreTeamDivision implements UseCase<
  Promise<Either<CoreTeamDivision, Error>>,
  CreateCoreTeamDivisionParams
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
    coreTeamDivision: Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CoreTeamDivision, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamDivisionRepository.createCoreTeamDivision(
        coreTeamDivision,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
