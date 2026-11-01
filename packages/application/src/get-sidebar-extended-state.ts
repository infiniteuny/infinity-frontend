import type { InternalRepository } from '@infiniteuny/infinity-domain';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';

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
