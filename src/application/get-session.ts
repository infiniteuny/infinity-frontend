import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Either } from 'effect/Either';
import { Session } from '@app/domain/entities';

@injectable()
export class GetSession implements UseCase<Promise<Either<Session, Error>>> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(request?: Request): Promise<Either<Session, Error>> {
    return await this.authRepository.getSession(request);
  }
}
