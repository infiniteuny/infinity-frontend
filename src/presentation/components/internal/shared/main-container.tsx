'use client';

import { Container } from '@mui/material';
import { InternalStoreContext } from './store-provider';
import { ReactNode, useContext, useSyncExternalStore } from 'react';

type Props = {
  children: ReactNode;
};

export function InternalMainContainer({ children }: Props) {
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`flex h-full min-h-[calc(100vh-8.625rem)] w-full flex-col overflow-auto pr-4 ${
        sidebarExtended ? 'lg:pl-65' : 'lg:pl-20'
      }`}
    >
      {children}
    </Container>
  );
}
