'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function Main({ children }: Props) {
  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className="flex h-full min-h-[calc(100vh-8.625rem)] w-full flex-col px-4 pb-4"
    >
      <Box
        id="content"
        component="main"
        sx={{ bgcolor: 'surfaceContainerLow.main' }}
        className="flow-root h-full w-full grow overflow-hidden rounded-2xl"
      >
        {children}
      </Box>
    </Container>
  );
}
