import type { MajorRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Major } from '@app/domain/entities';

export type CreateMajorParams = [
  major: Omit<Major, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateMajor implements UseCase<Promise<Either<Major, Error>>, CreateMajorParams> {
  private readonly majorRepository: MajorRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.MajorRepository)
    majorRepository: MajorRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.majorRepository = majorRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    major: Omit<Major, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Major, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.majorRepository.createMajor(major, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
