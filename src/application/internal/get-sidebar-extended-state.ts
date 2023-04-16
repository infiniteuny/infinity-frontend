import { inject, injectable } from 'inversify';
import { InternalRepository } from '@/domain/repositories';
import { Symbols } from '@/config';
import { UseCase } from '@/application/shared';

@injectable()
export class GetSidebarExtendedState implements UseCase<boolean> {
  private readonly internalRepository: InternalRepository;

  public constructor(
    @inject(Symbols.InternalRepository)
    internalRepository: InternalRepository,
  ) {
    this.internalRepository = internalRepository;
  }

  public execute(): boolean {
    return this.internalRepository.getSidebarExtendedState();
  }
}
