'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
  userId: string;
  isProfileView?: boolean;
};

export function UserPersonasToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
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
        {['create-user-persona', 'create-own-user-persona'].some((p) => userPermissions.has(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add user persona"
            LinkComponent={Link}
            href={
              isProfileView ? '/settings/profile/personas/new' : `/users/${userId}/personas/new`
            }
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
