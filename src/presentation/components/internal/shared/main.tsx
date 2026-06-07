'use client';

import NextLink from 'next/link';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { InternalStoreContext } from './store-provider';
import { ReactNode, useContext, useSyncExternalStore } from 'react';
import { NavigateNextRounded } from '@mui/icons-material';

type Props = {
  breadcrumbs?: {
    label: string;
    url: string;
  }[];
  children: ReactNode;
};

export function InternalMain({ breadcrumbs, children }: Props) {
  const store = useContext(InternalStoreContext);
  const sidebarExtended = useSyncExternalStore(
    store!.subscribe,
    () => store?.getState().sidebarExtended,
    () => true,
  );

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`h-full min-h-[calc(100vh-8.625rem)] w-full overflow-auto pr-4 ${
        sidebarExtended ? 'lg:pl-65' : 'lg:pl-20'
      }`}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs
          separator={<NavigateNextRounded fontSize="small" />}
          maxItems={3}
          aria-label="breadcrumb"
          className="my-2 px-4"
        >
          {breadcrumbs.map((breadcrumb, index) =>
            index === breadcrumbs.length - 1 ? (
              <Typography sx={{ color: 'text.primary' }} key={index}>
                {breadcrumb.label}
              </Typography>
            ) : (
              <Link
                component={NextLink}
                key={index}
                href={breadcrumb.url}
                underline="hover"
                color="text.disabled"
              >
                {breadcrumb.label}
              </Link>
            ),
          )}
        </Breadcrumbs>
      ) : null}
      <Box
        id="content"
        sx={{ bgcolor: 'surfaceContainerLow.main' }}
        className="flow-root h-full min-h-[calc(100vh-8.625rem)] w-full rounded-2xl"
      >
        {children}
      </Box>
    </Container>
  );
}
