'use client';

import { Container, Typography } from '@mui/material';
import { InternalStoreContext } from '@app/presentation/components/internal/shared';
import { useContext, useSyncExternalStore } from 'react';

export function InternalFooter() {
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );

  return (
    <Container
      component="footer"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`flex h-16 w-auto items-center px-6 py-2 md:px-12 lg:px-18 ${
        sidebarExtended ? 'lg:ml-65' : 'lg:ml-20'
      }`}
    >
      <Typography
        component="p"
        sx={{ color: 'outline' }}
        className="mx-auto my-0 max-w-2xl text-center"
      >
        &copy; {new Date().getFullYear()}. Made with &#128154; by INFINITE UNY.
      </Typography>
    </Container>
  );
}
