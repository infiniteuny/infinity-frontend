import type { AuthRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { Session } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

@injectable()
export class GetSession implements UseCase<Promise<Session | null>> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(): Promise<Session | null> {
    return await this.authRepository.getSession();
  }
}
