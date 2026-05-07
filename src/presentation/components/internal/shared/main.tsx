'use client';

import { Box, Container } from '@mui/material';
import { InternalStoreContext } from './store-provider';
import { ReactNode, useContext, useSyncExternalStore } from 'react';

type Props = {
  children: ReactNode;
};

export function InternalMain({ children }: Props) {
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );

  return (
    <Container
      id="content"
      component="main"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`h-full min-h-[calc(100vh-8.625rem)] w-full overflow-auto pr-4 ${
        sidebarExtended ? 'lg:pl-65' : 'lg:pl-20'
      }`}
    >
      <Box
        sx={{ bgcolor: 'surfaceContainerLow.main' }}
        className="flow-root h-full min-h-[calc(100vh-8.625rem)] w-full rounded-2xl"
      >
        {children}
      </Box>
    </Container>
  );
}
