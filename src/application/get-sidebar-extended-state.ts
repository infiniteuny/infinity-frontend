import type { InternalRepository } from '@app/domain/repositories';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

@injectable()
export class GetSidebarExtendedState implements UseCase<boolean> {
  private readonly internalRepository: InternalRepository;

  public constructor(
    @inject(SYMBOLS.InternalRepository)
    internalRepository: InternalRepository,
  ) {
    this.internalRepository = internalRepository;
  }

  public execute(): boolean {
    return this.internalRepository.getSidebarExtendedState();
  }
}
