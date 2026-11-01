'use client';

import NextLink from 'next/link';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNextRounded } from '@mui/icons-material';
import { ReactNode } from 'react';

type Props = {
  breadcrumbs?: {
    label: string;
    url: string;
  }[];
  children: ReactNode;
};

export function InternalMain({ breadcrumbs, children }: Props) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs
          separator={<NavigateNextRounded fontSize="small" />}
          maxItems={3}
          aria-label="breadcrumb"
          className="my-2 flex min-h-6 px-5"
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
        component="main"
        sx={{ bgcolor: 'surfaceContainerLow.main' }}
        className="flow-root h-full w-full grow rounded-2xl"
      >
        {children}
      </Box>
    </>
  );
}
