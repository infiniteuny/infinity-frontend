import type { InternalRepository } from '@app/domain/repositories';
import { clientContainer } from '@app/client-injection';
import { SYMBOLS } from '@config';

export function setSidebarExtendedState(state: boolean): void {
  const internalRepository = clientContainer.get<InternalRepository>(SYMBOLS.InternalRepository);

  internalRepository.setSidebarExtendedState(state);
}
