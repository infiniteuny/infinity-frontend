'use client';

import { clientContainer } from '@app/client-injection';
import { createInternalStore } from '@app/presentation/stores';
import { GetSidebarExtendedState } from '@infiniteuny/infinity-application';
import { InternalStoreContext } from './store-context';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { SessionDto, SessionMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { SYMBOLS } from '@infiniteuny/infinity-domain';

type Props = {
  session: SessionDto;
  children: ReactNode;
};

export function InternalStoreProvider({ session, children }: Props) {
  const [store] = useState(() => {
    const getSidebarExtendedState = clientContainer.get<GetSidebarExtendedState>(
      SYMBOLS.GetSidebarExtendedState,
    );

    return createInternalStore({
      sidebarExtended: getSidebarExtendedState.execute(),
      session: SessionMapper.fromDtoToDomain(session),
    });
  });

  const prevSessionRef = useRef(session);

  useEffect(() => {
    if (prevSessionRef.current === session) return;
    prevSessionRef.current = session;
    store.getState().setSession(SessionMapper.fromDtoToDomain(session));
  }, [store, session]);

  return <InternalStoreContext.Provider value={store}>{children}</InternalStoreContext.Provider>;
}
