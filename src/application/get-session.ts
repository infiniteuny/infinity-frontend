import type { AuthRepository } from '@app/domain/repositories';
import { Either, left, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { Session } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

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
    const tokenResult = await this.authRepository.getAccessToken(request);

    return match(tokenResult, {
      onLeft: (error) => left(error),
      onRight: async () => {
        const sessionResult = await this.authRepository.getSession(request);
        return sessionResult;
      },
    });
  }
}
