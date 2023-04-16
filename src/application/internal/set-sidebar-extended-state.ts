import { inject, injectable } from 'inversify';
import { InternalRepository } from '@/domain/repositories';
import { Symbols } from '@/config';
import { UseCase } from '@/application/shared';

export type SetSidebarExtendedStateParams = [state: boolean];

@injectable()
export class SetSidebarExtendedState implements UseCase<void, SetSidebarExtendedStateParams> {
  private readonly internalRepository: InternalRepository;

  public constructor(
    @inject(Symbols.InternalRepository)
    internalRepository: InternalRepository,
  ) {
    this.internalRepository = internalRepository;
  }

  public execute(state: boolean): void {
    this.internalRepository.setSidebarExtendedState(state);
  }
}
