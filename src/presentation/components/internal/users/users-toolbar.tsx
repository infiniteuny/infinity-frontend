'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
};

export function UsersToolbar({ dataGridApiRef }: Props) {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      <Box className="ml-auto">
        <IconButton
          className="ml-4"
          aria-label="Search"
          onClick={() => {
            dataGridApiRef.current?.showFilterPanel();
          }}
        >
          <SearchRounded />
        </IconButton>
        {['create-user'].some((p) => userPermissions.has(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add user"
            LinkComponent={Link}
            href="/users/new"
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
