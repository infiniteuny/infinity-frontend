'use client';

import { Container } from '@mui/material';
import { ReactNode } from 'react';
import { useSidebarExtended } from '@app/presentation/hooks';

type Props = {
  children: ReactNode;
};

export function InternalMainContainer({ children }: Props) {
  const sidebarExtended = useSidebarExtended();

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`flex h-full min-h-[calc(100vh-4rem)] w-full flex-col overflow-auto pt-18.5 pr-4 ${
        sidebarExtended ? 'lg:pl-65' : 'lg:pl-20'
      }`}
    >
      {children}
    </Container>
  );
}
