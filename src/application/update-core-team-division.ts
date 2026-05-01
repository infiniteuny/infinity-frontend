import type { CoreTeamDivisionRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { CoreTeamDivision } from '@app/domain/entities';

export type UpdateCoreTeamDivisionParams = [
  id: string,
  coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
];

@injectable()
export class UpdateCoreTeamDivision implements UseCase<
  Promise<Either<CoreTeamDivision, Error>>,
  UpdateCoreTeamDivisionParams
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
    coreTeamDivision: Partial<Omit<CoreTeamDivision, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
  ): Promise<Either<CoreTeamDivision, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.coreTeamDivisionRepository.updateCoreTeamDivision(
        id,
        coreTeamDivision,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
