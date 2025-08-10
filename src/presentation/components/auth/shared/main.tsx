'use client';

import { Container } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function AuthMain({ children }: Props) {
  return (
    <Container
      id="content"
      component="main"
      maxWidth={false}
      sx={{
        bgcolor: {
          xs: 'surface.main',
          sm: 'surfaceContainer.main',
        },
      }}
      className="px-0"
    >
      {children}
    </Container>
  );
}
