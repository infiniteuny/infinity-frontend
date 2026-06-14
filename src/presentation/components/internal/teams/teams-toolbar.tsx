'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
};

export function TeamsToolbar({ dataGridApiRef }: Props) {
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
        {['create-team', 'create-own-team'].some((p) => userPermissions.has(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add team"
            LinkComponent={Link}
            href="/teams/new"
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
