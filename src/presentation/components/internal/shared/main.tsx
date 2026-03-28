'use client';

import { Container } from '@mui/material';
import { ReactNode } from 'react';
import { internalStore, useShallow, useStore } from '@app/presentation/hooks';

type Props = {
  children: ReactNode;
};

export function InternalMain({ children }: Props) {
  const sidebarExtended = useStore(
    internalStore,
    useShallow((s) => s.sidebarExtended),
  );

  return (
    <Container
      id="content"
      component="main"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`min-h-[calc(100vh-4rem)] w-full overflow-auto px-0 ${
        sidebarExtended ? 'lg:pl-65' : 'lg:pl-20'
      }`}
    >
      {children}
    </Container>
  );
}
