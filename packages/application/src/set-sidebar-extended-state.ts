import type { InternalRepository } from '@infiniteuny/infinity-domain';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

export type SetSidebarExtendedStateParams = [state: boolean];

@injectable()
export class SetSidebarExtendedState implements UseCase<void, SetSidebarExtendedStateParams> {
  private readonly internalRepository: InternalRepository;

  public constructor(
    @inject(SYMBOLS.InternalRepository)
    internalRepository: InternalRepository,
  ) {
    this.internalRepository = internalRepository;
  }

  public execute(state: boolean): void {
    this.internalRepository.setSidebarExtendedState(state);
  }
}
