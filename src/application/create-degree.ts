import type { DegreeRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Degree } from '@app/domain/entities';

export type CreateDegreeParams = [
  degree: Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateDegree implements UseCase<Promise<Either<Degree, Error>>, CreateDegreeParams> {
  private readonly degreeRepository: DegreeRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.DegreeRepository)
    degreeRepository: DegreeRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.degreeRepository = degreeRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    degree: Omit<Degree, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Degree, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.degreeRepository.createDegree(degree, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
