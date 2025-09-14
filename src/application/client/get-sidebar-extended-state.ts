'use client';

import type { InternalRepository } from '@app/domain/repositories';
import { clientContainer } from '@app/client-injection';
import { SYMBOLS } from '@config';

export function getSidebarExtendedState(): boolean {
  const internalRepository = clientContainer.get<InternalRepository>(SYMBOLS.InternalRepository);

  return internalRepository.getSidebarExtendedState();
}
