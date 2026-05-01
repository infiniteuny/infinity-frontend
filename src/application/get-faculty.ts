import type { FacultyRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Faculty } from '@app/domain/entities';

export type GetFacultyParams = [id: string, abortSignal?: AbortSignal];

@injectable()
export class GetFaculty implements UseCase<Promise<Either<Faculty, Error>>, GetFacultyParams> {
  private readonly facultyRepository: FacultyRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.FacultyRepository)
    facultyRepository: FacultyRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.facultyRepository = facultyRepository;
    this.authRepository = authRepository;
  }

  public async execute(id: string, abortSignal?: AbortSignal): Promise<Either<Faculty, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.facultyRepository.getFaculty(id, abortSignal, accessTokenResult.right);
    } else {
      return left(accessTokenResult.left);
    }
  }
}
