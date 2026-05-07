'use client';

import { clientContainer } from '@app/client-injection';
import { createContext, ReactNode, useState } from 'react';
import { GetSidebarExtendedState } from '@app/application';
import { InternalStoreApi, createInternalStore } from '@app/presentation/stores';
import { SessionDto, SessionMapper } from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config/symbols';

export const InternalStoreContext = createContext<InternalStoreApi | undefined>(undefined);

type Props = {
  session: SessionDto;
  children: ReactNode;
};

export function InternalStoreProvider({ session, children }: Props) {
  const getSidebarExtendedState = clientContainer.get<GetSidebarExtendedState>(
    SYMBOLS.GetSidebarExtendedState,
  );

  const sidebarExtended = getSidebarExtendedState.execute();

  const parsedSession = SessionMapper.fromDtoToDomain(session);

  const [store] = useState(() =>
    createInternalStore({
      sidebarExtended,
      session: parsedSession,
    }),
  );

  return <InternalStoreContext.Provider value={store}>{children}</InternalStoreContext.Provider>;
}
